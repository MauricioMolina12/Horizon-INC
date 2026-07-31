# 🚀 Angular S3 + CloudFront Deployer

Script para desplegar aplicaciones Angular en AWS usando **S3 + CloudFront**, con configuración optimizada de cache, invalidación y soporte multi-entorno (development / production).

---

## 📦 Características

* ✅ Deploy automático de build Angular
* ✅ Configuración de cache optimizada
* ✅ Soporte para múltiples entornos
* ✅ Invalidación de CloudFront
* ✅ Detección y listado de archivos subidos
* ✅ Manejo correcto de MIME types
* ✅ Seguro para producción (sin limpieza destructiva por defecto)

---

## 🏗️ Arquitectura

```
Angular Build (dist/)
        ↓
      S3 Bucket
        ↓
   CloudFront CDN
        ↓
   Dominio (auth / devauth)
```

---

## 📁 Estructura del proyecto

```
deployment/
  ├── config.json
  ├── deploy.py
  ├── README.md
  └── requirements.txt
```

---

## ⚙️ Configuración

### `config.json`

```json
{
  "environments": {
    "development": {
      "bucket_name": "dev.holnex.com",
      "region": "us-east-1",
      "dist_path": "dist/devholnex",
      "distribution_id": "E1XXXXX"
    },
    "production": {
      "bucket_name": "holnex.com",
      "region": "us-east-1",
      "dist_path": "dist/holnex",
      "distribution_id": "E2XXXXX"
    }
  }
}
```

---

## 🔧 Requisitos

* Python 3.8+
* AWS CLI configurado (`aws configure`)
* Permisos:

  * `s3:PutObject`
  * `s3:ListBucket`
  * `cloudfront:CreateInvalidation`

Instalar dependencias:

```bash
pip install boto3
```

---

## 🏗️ Build del proyecto Angular

### Development

```bash
ng build --configuration=development
```

### Production

```bash
ng build --configuration=production
```

---

## 🚀 Deploy

### Development

```bash
python deploy.py development
```

### Production

```bash
python deploy.py production
```

---

## ☁️ CloudFront Invalidation

El script automáticamente ejecuta:

```text
/*
```

Esto asegura que:

* No se sirvan archivos en cache antiguos
* Los cambios se reflejen inmediatamente

---

## 🧠 Estrategia de Cache

| Archivo    | Cache-Control                       |
| ---------- | ----------------------------------- |
| index.html | no-cache, no-store, must-revalidate |
| assets     | public, max-age=31536000, immutable |
| js/css     | public, max-age=31536000, immutable |

---

## 📄 Output del script

Ejemplo:

```
✅ Subido: index.html
✅ Subido: main.abc123.js
✅ Subido: styles.xyz.css

📦 Resumen de deploy:
   Total archivos subidos: 3

📄 Archivos:
   - index.html
   - main.abc123.js
   - styles.xyz.css
```

---

## ⚠️ Consideraciones importantes

### 🔹 Angular Routing

Asegúrate de tener en CloudFront:

* 403 → `/index.html`
* 404 → `/index.html`

---

### 🔹 `base href`

```html
<base href="/">
```

---

### 🔹 S3 Bucket

* Privado (recomendado)
* Acceso solo desde CloudFront (OAC)

---

## ❌ Problemas comunes

### Pantalla en blanco

* Error en consola JS
* Archivos JS no cargando (403)

### Rutas no funcionan al refrescar

* Falta configuración de error pages en CloudFront

### Cambios no se reflejan

* Cache → invalidación requerida

---

## 🔒 Seguridad

* No se elimina contenido del bucket por defecto
* Invalidación controlada
* Compatible con OAC (Origin Access Control)

---

## 🚀 Mejores prácticas

* Usar builds separados:

  * dev → `devauth`
  * prod → `auth`
* No cachear `index.html`
* Cachear assets agresivamente
* Automatizar con CI/CD

---

## 📈 Próximos pasos

* Integración con GitHub Actions
* Deploy automático por branch
* Versionado de builds

---

## 👨‍💻 Autor

Setup optimizado para despliegues Angular en AWS con buenas prácticas de performance y caching.

---
