import os
import boto3
import mimetypes
import time
import argparse
import json
import sys
from botocore.exceptions import ClientError, NoCredentialsError, ProfileNotFound

# Forzar UTF-8 en stdout/stderr para que los emojis no rompan en consolas
# de Windows que usan cp1252 (p. ej. al redirigir la salida a un log).
for stream in (sys.stdout, sys.stderr):
    try:
        stream.reconfigure(encoding='utf-8')
    except (AttributeError, ValueError):
        pass


class S3AngularDeployer:
    def __init__(self, bucket_name, region='us-east-1'):
        self.bucket_name = bucket_name
        self.region = region
        self.s3_client = boto3.client('s3', region_name=region)

        self.cache_configs = {
            'index.html': {
                'CacheControl': 'no-cache, no-store, must-revalidate'
            },
            'assets': {
                'CacheControl': 'public,max-age=31536000,immutable'
            },
            'default': {
                'CacheControl': 'public,max-age=31536000,immutable'
            }
        }

    def get_cache_config(self, file_path):
        if file_path.endswith('index.html'):
            return self.cache_configs['index.html']
        elif 'assets' in file_path:
            return self.cache_configs['assets']
        return self.cache_configs['default']

    def get_content_type(self, file_path):
        if file_path.endswith('.js'):
            return 'application/javascript'
        if file_path.endswith('.css'):
            return 'text/css'
        if file_path.endswith('.json'):
            return 'application/json'
        if file_path.endswith('.svg'):
            return 'image/svg+xml'
        if file_path.endswith('.woff2'):
            return 'font/woff2'
        if file_path.endswith('.ico'):
            return 'image/x-icon'

        mime, _ = mimetypes.guess_type(file_path)
        return mime or 'application/octet-stream'

    def upload(self, dist_path):
        if not os.path.exists(dist_path):
            print(f"❌ No existe la carpeta: {dist_path}")
            return False

        print(f"📦 Subiendo archivos desde: {dist_path}\n")

        uploaded_files = []

        for root, _, files in os.walk(dist_path):
            for file in files:
                local_path = os.path.join(root, file)
                key = os.path.relpath(local_path, dist_path).replace('\\', '/')

                cache = self.get_cache_config(local_path)

                self.s3_client.upload_file(
                    local_path,
                    self.bucket_name,
                    key,
                    ExtraArgs={
                        'CacheControl': cache['CacheControl'],
                        'ContentType': self.get_content_type(local_path)
                    }
                )

                print(f"✅ {key}")
                uploaded_files.append(key)

        print("\n📊 Resumen:")
        print(f"Total archivos subidos: {len(uploaded_files)}")

        return True

    def invalidate(self, distribution_id):
        print("\n☁️ Iniciando invalidación de CloudFront...")

        cf = boto3.client('cloudfront', region_name=self.region)

        res = cf.create_invalidation(
            DistributionId=distribution_id,
            InvalidationBatch={
                'Paths': {
                    'Quantity': 1,
                    'Items': ['/*']
                },
                'CallerReference': str(time.time())
            }
        )

        invalidation_id = res['Invalidation']['Id']
        print(f"✅ Invalidation ID: {invalidation_id}")


def resolve_config_path(path):
    """Resuelve la ruta del config: primero relativo al cwd, luego junto al script."""
    candidates = [path]
    if not os.path.isabs(path):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        candidates.append(os.path.join(script_dir, path))

    for candidate in candidates:
        if os.path.exists(candidate):
            return candidate

    return None


def load_config(path):
    resolved = resolve_config_path(path)
    if resolved is None:
        searched = [os.path.abspath(path)]
        if not os.path.isabs(path):
            searched.append(
                os.path.abspath(
                    os.path.join(os.path.dirname(os.path.abspath(__file__)), path)
                )
            )
        raise Exception(
            f"No se encontró el archivo {path}. Buscado en: {', '.join(searched)}"
        )

    with open(resolved, 'r', encoding='utf-8') as f:
        return json.load(f)['environments']


CREDENTIAL_HINTS = {
    'InvalidAccessKeyId': (
        'El Access Key ID no existe en los registros de AWS: fue eliminado o rotado.\n'
        '   Genera una access key nueva en IAM (o la del equipo) y actualiza ~/.aws/credentials.'
    ),
    'InvalidClientTokenId': (
        'El security token es inválido o la access key fue desactivada.\n'
        '   Genera una access key nueva en IAM (o la del equipo) y actualiza ~/.aws/credentials.'
    ),
    'ExpiredToken': (
        'El token de sesión expiró.\n'
        '   Re-autentícate o renueva la access key en IAM.'
    ),
    'SignatureDoesNotMatch': (
        'La firma no coincide: el secret access key es incorrecto.\n'
        '   Verifica el par access key / secret key en ~/.aws/credentials.'
    ),
    'UnrecognizedClientException': (
        'La autenticación falló: el par access key / secret key no es válido.\n'
        '   Verifica ~/.aws/credentials y que la access key siga activa en IAM.'
    ),
    'AccessDenied': (
        'Las credenciales son válidas pero no tienen permisos S3/CloudFront\n'
        '   para este bucket/distribución. Revisa la política de IAM.'
    ),
}


def format_credentials_error(error):
    code = getattr(error, 'response', None) or {}
    err = code.get('Error', {}) if isinstance(code, dict) else {}
    message = err.get('Message', str(error))
    hint = CREDENTIAL_HINTS.get(err.get('Code', ''), '')
    return f"{message}\n   {hint}" if hint else str(message)


def check_credentials(region):
    """Valida las credenciales AWS con STS GetCallerIdentity (gratuito) antes de subir."""
    try:
        boto3.client('sts', region_name=region).get_caller_identity()
        return True, None
    except (ClientError, NoCredentialsError, ProfileNotFound) as e:
        return False, e


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--env', required=True, choices=['development', 'production'])
    parser.add_argument('--config', default='config.json')
    parser.add_argument('--invalidate-cloudfront', action='store_true')

    args = parser.parse_args()

    config_path = resolve_config_path(args.config)
    if config_path is None:
        print(f"❌ No se encontró el archivo de configuración: {args.config}")
        return

    envs = load_config(config_path)

    if args.env not in envs:
        print(f"❌ Entorno no encontrado: {args.env}")
        return

    cfg = dict(envs[args.env])

    # Resolver dist_path relativo al directorio del config.json, así funciona
    # sin importar desde qué carpeta se ejecute el script.
    dist_path = cfg['dist_path']
    if not os.path.isabs(dist_path):
        cfg['dist_path'] = os.path.normpath(
            os.path.join(os.path.dirname(os.path.abspath(config_path)), dist_path)
        )

    print(f"🚀 Deploying: {args.env}")
    print(f"Bucket: {cfg['bucket_name']}")
    print(f"Dist: {cfg['dist_path']}\n")

    deployer = S3AngularDeployer(
        bucket_name=cfg['bucket_name'],
        region=cfg.get('region', 'us-east-1')
    )

    region = cfg.get('region', 'us-east-1')

    print('☁️ Verificando credenciales AWS...')
    ok, error = check_credentials(region)
    if not ok:
        print('❌ Credenciales AWS no válidas.')
        print(f'   {format_credentials_error(error)}')
        print('\n   Revisa el archivo: ~/.aws/credentials')
        return

    try:
        success = deployer.upload(cfg['dist_path'])
    except ClientError as e:
        print('❌ Error al subir a S3:')
        print(f'   {format_credentials_error(e)}')
        return

    if success and args.invalidate_cloudfront:
        cf = cfg.get('cloudfront', {})
        if cf.get('enabled') and cf.get('distribution_id'):
            deployer.invalidate(cf['distribution_id'])
        else:
            print("⚠️ CloudFront no configurado")


if __name__ == "__main__":
    main()