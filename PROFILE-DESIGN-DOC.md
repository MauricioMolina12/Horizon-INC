# Hölnex Profile — Diseño UX/UI del Dashboard Personal

> **Concepto:** "My Space" — No es un perfil, es el centro de comando personal del usuario.
>
> Inspirado en: Stripe Dashboard, Linear, Spotify Wrapped, Arc Browser, GitHub Profile, Revolut, Apple ID.

---

## Índice

1. [Concepto UX](#1-concepto-ux)
2. [Investigación Resumida](#2-investigación-resumida)
3. [Arquitectura de Información](#3-arquitectura-de-información)
4. [User Journey](#4-user-journey)
5. [Wireframe en ASCII](#5-wireframe-en-ascii)
6. [Diseño Detallado de Cada Sección](#6-diseño-detallado-de-cada-sección)
7. [Componentes](#7-componentes)
8. [Responsive](#8-responsive)
9. [Microinteracciones](#9-microinteracciones)
10. [Estados Vacíos](#10-estados-vacíos)
11. [Estados de Carga](#11-estados-de-carga)
12. [Estados de Error](#12-estados-de-error)
13. [Accesibilidad](#13-accesibilidad)
14. [Design Tokens](#14-design-tokens)
15. [Roadmap MVP → V2 → V3](#15-roadmap-mvp--v2--v3)
16. [Autocrítica: 10+ Oportunidades de Mejora](#16-autocrítica-10-oportunidades-de-mejora)

---

## 1. Concepto UX

### Nombre del Concepto: **"My Space"**

No es "Mi Perfil". No es "Configuración". Es **el espacio personal** del usuario dentro del ecommerce.

### Narrativa

Cada vez que un usuario entra a "My Space", debe sentir que el sistema lo reconoce. No como un número de cliente, sino como una persona con gustos, historia y comportamientos.

**El usuario debe pensar:**
- "Este ecommerce me entiende."
- "Aquí puedo ver mi historia."
- "Esto se siente mío."
- "Quiero presumir mi nivel."

### Diferenciadores clave frente a ecommerce tradicionales

| Tradicional | My Space |
|---|---|
| Sidebar con links genéricos | Dashboard visual sin navegación lateral |
| Formularios para editar datos | Acceso rápido tipo tarjeta |
| Lista de pedidos en tabla | Timeline viva con actividad |
| Configuración como foco principal | Configuración al fondo, en acordeón |
| Datos fríos (total gastado) | Insights inteligentes (marca favorita, tendencias) |
| Perfil estático | Perfil que evoluciona (niveles, logros) |
| Diseño funcional | Diseño emocional |

### Sensaciones que debe provocar

| Sensación | Cómo se logra |
|---|---|
| **Personalización** | Avatar, nivel, nombre, insights basados en datos reales del usuario |
| **Inteligencia** | "Hölnex te conoce" — recomendaciones y resúmenes automáticos |
| **Historia** | Timeline vertical con eventos cronológicos |
| **Actividad** | El dashboard se actualiza con cada acción del usuario |
| **Propiedad** | "Mi nivel", "Mi colección", "Mis ahorros" |
| **Elegancia** | Whitespace generoso, tipografía limpia, micro-interacciones sutiles |

---

## 2. Investigación Resumida

### Benchmarking de referencias

| Referencia | Qué tomar | Qué evitar |
|---|---|---|
| **Stripe Dashboard** | Cards informativas, jerarquía visual clara, whitespace | Complejidad de datos financieros |
| **Linear** | Timeline limpia, etiquetas de estado, micro-interacciones | Enfoque solo en bugs/tasks |
| **Spotify Wrapped** | Resumen inteligente, storytelling con datos, colores vibrantes | Diseño estacional, no persistente |
| **Arc Browser** | Espacios, perfil visual, organización por espacios | Curva de aprendizaje alta |
| **GitHub Profile** | Grid de repositorios como colección, contribuciones | Demasiado técnico |
| **Revolut** | Niveles, barras de progreso, gamificación | UI densa |
| **Apple ID** | Minimalismo, fotografía grande, configuración en acordeón | Poca personalización |
| **Notion** | Bloques independientes, layouts flexibles | Complejidad de edición |

### Insights de usuarios (hipotéticos para MVP)

1. **El 78%** de los usuarios de ecommerce solo entran a su perfil para editar dirección o ver un pedido.
2. **El 62%** dice que "no hay razón" para visitar su perfil regularmente.
3. **El 45%** valora que una marca "lo conozca" y le recomiende bien.
4. **El 33%** compartiría su nivel o logros si fueran "presumibles".
5. **El 70%** prefiere ver su actividad en formato visual que en tablas.

**Conclusión:** El perfil actual es transaccional. Necesita ser **aspiracional**.

---

## 3. Arquitectura de Información

### Estructura plana (sin anidamiento)

```
My Space (una sola vista / scroll vertical)
│
├── 1. HERO ──────────────────────────────── Altura completa (100vh)
│   ├── Avatar grande
│   ├── Nombre + Correo
│   ├── Cliente desde + Última compra
│   ├── Nivel + Barra de progreso
│   ├── Total ahorrado + Total pedidos
│   └── Botón editar avatar (flotante)
│
├── 2. RESUMEN INTELIGENTE ───────────────── Grid de 2-3 columnas
│   ├── Marca favorita
│   ├── Categoría favorita
│   ├── Color favorito
│   ├── Productos comprados
│   ├── Dinero ahorrado
│   └── Patrón de compra
│
├── 3. TIMELINE ──────────────────────────── Scroll vertical
│   ├── Evento: Pedido entregado
│   ├── Evento: Producto favorito
│   ├── Evento: Nueva compra
│   ├── Evento: Calificación
│   └── Evento: Actualización de perfil
│
├── 4. COLECCIÓN ─────────────────────────── Grid visual
│   ├── Tarjeta de producto comprado
│   ├── Tarjeta de producto comprado
│   ├── Tarjeta de producto comprado
│   └── ...
│
├── 5. ACCIONES RÁPIDAS ──────────────────── Grid de 3 columnas
│   ├── Editar perfil
│   ├── Direcciones
│   ├── Seguridad
│   ├── Métodos de pago
│   ├── Wishlist
│   └── Soporte
│
├── 6. RECOMENDACIONES IA ────────────────── Widget destacado
│   └── Cards de productos recomendados
│
└── 7. CONFIGURACIÓN ─────────────────────── Acordeones
    ├── Cuenta
    ├── Privacidad
    ├── Seguridad
    ├── Notificaciones
    └── Eliminar cuenta
```

### Principios de navegación

- **Zero clicks para ver lo importante:** Todo está en la misma vista con scroll.
- **Progressive disclosure:** Los detalles (editar, configurar) están en cards modales o expandibles.
- **Sin sidebar:** Reemplazado por Acciones Rápidas en la misma vista.
- **Sin tabs:** La vista única elimina la fricción de cambiar de pestaña.

---

## 4. User Journey

### Journey principal: "Usuario recurrente revisa su espacio"

```mermaid
flowchart TD
    A[Llega al ecommerce] --> B{¿Qué quiere hacer?}
    B -->|"Ver su perfil"| C[Click en avatar / "My Space"]
    B -->|"Comprar"| D[Catálogo]
    B -->|"Pedidos"| C
    
    C --> E[Hero: ve su nombre, nivel, saludo]
    E --> F[Resumen Inteligente: "Compras principalmente Sneakers"]
    F --> G[Timeline: ve su actividad reciente]
    G --> H[Colección: ve productos comprados]
    H --> I[Acciones Rápidas: click en Wishlist]
    I --> J[Modal: Wishlist se abre como overlay]
    J --> K[Vuelve al dashboard o cierra]
```

### Journey secundario: "Usuario nuevo sin datos"

```mermaid
flowchart TD
    A[Primera compra] --> B[Entra a My Space]
    B --> C[Hero con datos básicos + nivel 1]
    C --> D[Resumen Inteligente vacío: "Todavía no tenemos datos"]
    D --> E[Timeline: solo evento de registro + primera compra]
    E --> F[Colección: 1 tarjeta del producto comprado]
    F --> G[Recomendaciones IA: basadas en su única compra]
    G --> H[Configuración: completa sus datos]
```

---

## 5. Wireframe en ASCII

### Vista Desktop

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   ╔═══════════════════════════════════════════════════════════╗  │
│   ║                    HERO (100vh)                          ║  │
│   ║                                                          ║  │
│   ║                    ┌──────┐                              ║  │
│   ║                    │      │  ✏️                           ║  │
│   ║                    │ AVAT │                              ║  │
│   ║                    │      │                              ║  │
│   ║                    └──────┘                              ║  │
│   ║                                                          ║  │
│   ║              Alejandro García                            ║  │
│   ║              alejandro@holnex.com                        ║  │
│   ║                                                          ║  │
│   ║     Cliente desde     Última compra                      ║  │
│   ║     Ene 2024          3 días atrás                      ║  │
│   ║                                                          ║  │
│   ║     ┌── NIVEL BRONCE ──┐                                 ║  │
│   ║     │ ████████░░░░░░░ │  3/8 para Plata                ║  │
│   ║     └─────────────────┘                                 ║  │
│   ║                                                          ║  │
│   ║     Total ahorrado          Total pedidos                ║  │
│   ║     $350.00                12                            ║  │
│   ║                                                          ║  │
│   ╚═══════════════════════════════════════════════════════════╝  │
│                                                                  │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                                  │
│   RESUMEN INTELIGENTE                                            │
│                                                                  │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│   │ 👟       │  │ 🏷️      │  │ 🎨      │                        │
│   │ Sneakers │  │ Nike    │  │ Negro   │                        │
│   │ Fav cat  │  │ Fav brand│  │ Fav color│                       │
│   └─────────┘  └─────────┘  └─────────┘                        │
│                                                                  │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│   │ 📦       │  │ 💰      │  │ 📅      │                        │
│   │ 48       │  │ $350    │  │ Finde   │                        │
│   │ Products │  │ Ahorrado│  │ Patrón  │                        │
│   └─────────┘  └─────────┘  └─────────┘                        │
│                                                                  │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                                  │
│   ACTIVIDAD RECIENTE                                             │
│                                                                  │
│   ● Pedido entregado                             Hace 3 días    │
│   │                                                              │
│   ● Agregaste a favoritos                       Hace 5 días     │
│   │                                                              │
│   ● Compraste "Auriculares Pro"                 Hace 1 semana   │
│   │                                                              │
│   ● Calificaste ★★★★★                           Hace 2 semanas  │
│   │                                                              │
│   ● Actualizaste tu dirección                    Hace 1 mes      │
│                                                                  │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                                  │
│   MI COLECCIÓN                                                   │
│                                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│   │ 🖼️       │  │ 🖼️       │  │ 🖼️       │                     │
│   │ Producto │  │ Producto │  │ Producto │                     │
│   │  A       │  │  B       │  │  C       │                     │
│   │ $1,250   │  │ $3,400   │  │ $890     │                     │
│   │ [▶] [S]  │  │ [▶] [S]  │  │ [▶] [S]  │                     │
│   └──────────┘  └──────────┘  └──────────┘                     │
│                                                                  │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                                  │
│   ACCIONES RÁPIDAS                                               │
│                                                                  │
│   ┌────────────┐ ┌────────────┐ ┌────────────┐                 │
│   │ ✏️ Perfil   │ │ 📍 Dir.    │ │ 🔒 Seg.    │                 │
│   └────────────┘ └────────────┘ └────────────┘                 │
│   ┌────────────┐ ┌────────────┐ ┌────────────┐                 │
│   │ 💳 Pagos   │ │ ❤️ Wishlist│ │ 🆘 Soporte  │                 │
│   └────────────┘ └────────────┘ └────────────┘                 │
│                                                                  │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                                  │
│   RECOMENDACIONES PARA TI                                        │
│                                                                  │
│   ┌─────────────────────────────────────────────────────┐       │
│   │  Basado en tus compras de Sneakers, creemos que     │       │
│   │  te encantará:                                      │       │
│   │                                                     │       │
│   │  ┌────────┐ ┌────────┐ ┌────────┐                  │       │
│   │  │ 🖼️     │ │ 🖼️     │ │ 🖼️     │                  │       │
│   │  │ Prod X │ │ Prod Y │ │ Prod Z │                  │       │
│   │  └────────┘ └────────┘ └────────┘                  │       │
│   └─────────────────────────────────────────────────────┘       │
│                                                                  │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                                  │
│   CONFIGURACIÓN                                                 │
│                                                                  │
│   ┌─────────────────────────────────────────────────────┐       │
│   │ ▶ Cuenta                                          │       │
│   ├─────────────────────────────────────────────────────┤       │
│   │ ▶ Privacidad                                      │       │
│   ├─────────────────────────────────────────────────────┤       │
│   │ ▶ Seguridad                                       │       │
│   ├─────────────────────────────────────────────────────┤       │
│   │ ▶ Notificaciones                                  │       │
│   ├─────────────────────────────────────────────────────┤       │
│   │ ⚠ Eliminar cuenta                                 │       │
│   └─────────────────────────────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Vista Mobile (transformación)

```
┌──────────────────┐
│   ┌──────┐       │
│   │      │  ✏️    │
│   │ AVAT │       │
│   │      │       │
│   └──────┘       │
│                   │
│ Alejandro García  │
│ alejandro@holnex  │
│                   │
│ NIVEL BRONCE      │
│ ████████░░░░░░░   │
│ 3/8 para Plata    │
│                   │
│ $350 ahorrados    │  ← Se simplifica
│ 12 pedidos        │
│                   │
├──────────────────┤
│                   │
│ RESUMEN           │
│ ┌──────┐ ┌──────┐ │
│ │ 👟   │ │ 🏷️  │ │
│ │Sneak │ │Nike  │ │
│ └──────┘ └──────┘ │
│ ┌──────┐ ┌──────┐ │
│ │ 48   │ │$350  │ │
│ │Prod  │ │Ahorr │ │
│ └──────┘ └──────┘ │
│                   │
├──────────────────┤
│                   │
│ ACTIVIDAD         │
│ ● Pedido entregado│
│ ● Favorito       │
│ ● Compra         │
│ ● Calificación   │
│ ● Dirección      │
│                   │
├──────────────────┤
│                   │
│ COLECCIÓN (2 cols)│
│ ┌────┐ ┌────┐   │
│ │ 🖼 │ │ 🖼 │   │
│ │ A  │ │ B  │   │
│ └────┘ └────┘   │
│ ┌────┐ ┌────┐   │
│ │ 🖼 │ │ 🖼 │   │
│ │ C  │ │ D  │   │
│ └────┘ └────┘   │
│                   │
├──────────────────┤
│                   │
│ ACCIONES (2 cols) │
│ ┌──────┐ ┌──────┐│
│ │Perfil│ │Dir.  ││
│ └──────┘ └──────┘│
│ ┌──────┐ ┌──────┐│
│ │Seg.  │ │Pagos ││
│ └──────┘ └──────┘│
│ ┌──────┐ ┌──────┐│
│ │ Wish │ │Sop.  ││
│ └──────┘ └──────┘│
│                   │
├──────────────────┤
│                   │
│ RECOMENDACIONES   │
│ ┌──────────────┐ │
│ │ Prod X       │ │
│ │ Prod Y       │ │
│ │ Prod Z       │ │
│ └──────────────┘ │
│                   │
├──────────────────┤
│                   │
│ CONFIGURACIÓN     │
│ ▶ Cuenta         │
│ ▶ Privacidad     │
│ ▶ Seguridad      │
│ ▶ Notificaciones │
│ ⚠ Eliminar       │
│                   │
└──────────────────┘
```

---

## 6. Diseño Detallado de Cada Sección

### 6.1 Hero — "Tu Identidad"

**¿Por qué existe?**
Es la primera impresión. El usuario debe sentirse reconocido inmediatamente.

**Problema que resuelve:**
Los perfiles tradicionales esconden la identidad del usuario en una barra lateral pequeña. El Hero grande dice: "este espacio es sobre ti".

**Layout:**
- Full-width, altura mínima 100vh
- Centrado vertical y horizontalmente
- Avatar: 120px (desktop) / 80px (mobile), con borde sutil y sombra
- Botón editar: flotante sobre el avatar, solo visible en hover/tap
- Nombre: 48px, bold
- Correo: 16px, opacidad 60%
- Metadata (cliente desde, última compra): en fila, con íconos pequeños
- Nivel: tarjeta con badge y barra de progreso
- Stats: dos cards flotantes (total ahorrado, total pedidos)

**Estados:**
- **Default:** Todo visible, con entrada animada (fade-in + translateY)
- **Hover avatar:** El lápiz aparece con escala suave
- **Click lápiz:** Modal de subir foto (drag & drop o file picker)
- **Loading:** Skeleton con círculo + líneas de texto
- **Empty (sin nombre):** Mostrar "Bienvenido, guest" con call to action a completar perfil

### 6.2 Resumen Inteligente — "Hölnex te conoce"

**¿Por qué existe?**
Los datos duros no generan conexión emocional. Los insights sí.

**Problema que resuelve:**
Humaniza la relación usuario-marca. El usuario descubre patrones que ni él mismo había notado.

**Layout:**
- Grid de 3 columnas en desktop, 2 en tablet, 2 en mobile
- Cada insight es una card pequeña con:
  - Ícono grande (emoji o SVG)
  - Label pequeño (marca favorita)
  - Valor destacado (Nike)
- 6 cards en total: Marca, Categoría, Color, Productos, Ahorro, Patrón

**Estados:**
- **Con datos:** Cards con valores reales
- **Sin datos:** "Todavía no te conocemos bien. Sigue comprando para ver tus insights." + imagen ilustrativa
- **Loading:** Skeleton grid con 6 rectángulos

### 6.3 Timeline — "Tu Historia"

**¿Por qué existe?**
Las listas de pedidos son transaccionales. Una timeline es narrativa.

**Problema que resuelve:**
Muestra la relación del usuario con la marca como una historia en evolución, no como una tabla de transacciones.

**Layout:**
- Línea vertical al lado izquierdo
- Cada evento es un item con:
  - Círculo con ícono (check, heart, cart, star, edit)
  - Descripción: "Compraste Nike Air Max"
  - Fecha: "Hace 3 días"
  - Enlace opcional: "Ver pedido", "Ver producto"
- Orden cronológico inverso

**Tipos de eventos (MVP):**
- `order_delivered`: Pedido entregado
- `product_favorited`: Agregaste a favoritos
- `product_purchased`: Compraste nuevamente
- `product_rated`: Calificaste un producto
- `profile_updated`: Actualizaste tu perfil
- `address_updated`: Actualizaste dirección
- `wishlist_added`: Agregaste a wishlist

**Estados:**
- **Con actividad:** Timeline con 5+ eventos mínimo
- **Sin actividad:** "Tu historia comienza aquí. Tu primera compra será el primer capítulo."
- **Loading:** 5 skeleton items con círculos y líneas

### 6.4 Colección — "Tu Galería"

**¿Por qué existe?**
Las compras son parte de la identidad del usuario. Mostrarlas como galería genera orgullo y ganas de compartir.

**Problema que resuelve:**
Hace que las compras sean "poseídas" visualmente, no solo datos en una tabla.

**Layout:**
- Grid de 3 columnas (desktop), 2 (mobile)
- Cada tarjeta:
  - Imagen del producto (aspect ratio 1:1)
  - Nombre del producto
  - Precio pagado
  - Estado del pedido (badge)
  - Hover: overlay con botones "Comprar otra vez", "Ver similares", "Compartir"

**Estados:**
- **Con productos:** Grid con tarjetas
- **Sin productos:** "Tu colección está vacía. Empieza a comprar para llenarla." + CTA a catálogo
- **Loading:** Skeleton grid con 6 cards

### 6.5 Acciones Rápidas — "Tu Centro de Control"

**¿Por qué existe?**
Reemplaza al sidebar tradicional. Las acciones más comunes deben estar a un click de distancia.

**Problema que resuelve:**
Elimina la navegación lateral que compite visualmente con el contenido y entorpece en mobile.

**Layout:**
- Grid de 3 columnas (desktop), 2 (mobile)
- Cada card:
  - Ícono grande (SVG outline)
  - Nombre de la acción
  - Hover: elevación + color de fondo sutil
  - Click: abre modal o navega a sub-ruta

**Acciones MVP:**
1. Editar perfil
2. Direcciones
3. Seguridad
4. Métodos de pago
5. Wishlist
6. Soporte

**Estados:**
- **Default:** 6 cards visibles
- **Loading:** No aplica (es navegación, no datos)

### 6.6 Recomendaciones IA — "Para Ti"

**¿Por qué existe?**
Demuestra que el sistema aprende del usuario. Es el momento "wow" del dashboard.

**Problema que resuelve:**
Personaliza la experiencia de descubrimiento de productos sin que el usuario tenga que buscar.

**Layout:**
- Contenedor destacado (borde sutil, fondo ligeramente diferente)
- Texto introductorio: "Basado en tu historial, creemos que te encantará:"
- Grid de 3 productos (desktop), 2 (mobile)
- Cada producto: imagen + nombre + precio + botón "Ver producto"

**Estados:**
- **Con datos:** 3-6 productos recomendados
- **Sin datos:** "A medida que compres, aprenderemos tus gustos y te recomendaremos productos."
- **Loading:** Skeleton con 3 cards

### 6.7 Configuración — "Ajustes" (al fondo)

**¿Por qué existe?**
Necesaria pero no debe ser el foco. El usuario no entra a su perfil para configurar, entra para verse a sí mismo.

**Problema que resuelve:**
Saca la configuración del camino principal sin eliminarla.

**Layout:**
- Acordeones (expandir/colapsar)
- Cada sección: icono + título + flecha
- Al expandir: formularios inline o redirección a modal
- "Eliminar cuenta" al fondo con color de advertencia

**Secciones:**
1. Cuenta (nombre, email, teléfono)
2. Privacidad (datos visibles, preferencias de comunicación)
3. Seguridad (contraseña, 2FA)
4. Notificaciones (push, email, SMS)
5. ⚠ Eliminar cuenta

**Estados:**
- **Default:** Todos colapsados
- **Expanded:** Un acordeón abierto a la vez
- **Loading while saving:** Spinner inline en el botón de guardar

---

## 7. Componentes

### 7.1 Catálogo de Componentes

| Componente | ¿Por qué existe? | Problema que resuelve | Mejora UX |
|---|---|---|---|
| **ProfileHero** | Punto focal del dashboard | El usuario necesita sentirse identificado al entrar | Crea conexión emocional inmediata |
| **AvatarUploader** | Cambiar foto sin navegar a otra página | Los perfiles tradicionales requieren ir a "editar" para cambiar foto | Elimina fricción, feedback instantáneo |
| **UserBadge** | Mostrar nivel del usuario | Gamificación sin ser agresiva | Genera orgullo y motivación |
| **LevelProgress** | Barra de progreso hacia el siguiente nivel | Los usuarios necesitan saber qué falta para subir de nivel | Incentiva más compras |
| **MetricCard** | Mostrar un número importante con contexto | Los datos sueltos no comunican valor | Hace los números escaneables |
| **InsightCard** | Mostrar un insight inteligente | Los datos de compras no son interesantes sin contexto | Humaniza los datos |
| **StatCard** | Mostrar estadísticas clave (ahorro, pedidos) | El usuario quiere ver resumen rápido | Información escaneable |
| **Timeline** | Narrar la actividad del usuario | Las listas de pedidos son frías y transaccionales | Crea una historia |
| **TimelineItem** | Cada evento en la timeline | Necesidad de representar distintos tipos de evento | Consistencia visual |
| **ActivityCard** | Versión compacta de un evento | Vista resumida de actividad | Ahorra espacio vertical |
| **CollectionGrid** | Galería de productos comprados | Las tablas de compras no son visuales ni "instagrameables" | Genera orgullo de propiedad |
| **CollectionCard** | Cada producto en la colección | Los productos deben ser "poseídos" visualmente | Hover actions mejoran recompra |
| **QuickActions** | Reemplazar sidebar | Los sidebars son malos en mobile y roban atención | Acceso directo sin obstáculos |
| **QuickActionCard** | Cada acción individual | Necesidad de ícono + label + click | Touch target grande |
| **RecommendationCard** | Producto recomendado por IA | Descubrimiento sin esfuerzo | Personalización real |
| **RecommendationWidget** | Contenedor de recomendaciones | Agrupar recomendaciones con contexto | Da credibilidad a la IA |
| **SettingsAccordion** | Configuración colapsable | La config no debe ser el foco pero debe existir | Progressive disclosure |
| **SkeletonHero** | Estado de carga del Hero | El usuario necesita feedback inmediato | Reduce percepción de espera |
| **SkeletonGrid** | Estado de carga del grid | Consistencia en loading | Percepción de velocidad |
| **EmptyState** | Sin datos disponibles | El usuario nuevo no debe ver pantallas rotas | Guía al usuario a la acción |
| **ErrorState** | Algo salió mal | Los errores son frustrantes si no se manejan bien | Reduce frustración |
| **ConfettiOverlay** | Celebración al subir nivel | Gamificación necesita recompensa visual | Delight puro |

### 7.2 Jerarquía de Componentes (Angular Standalone)

```
profile-page (standalone, lazy-loaded)
│
├── profile-hero
│   ├── avatar-uploader
│   ├── user-badge
│   ├── level-progress
│   ├── metric-card (ahorro)
│   └── metric-card (pedidos)
│
├── insights-section
│   └── insight-card × 6
│
├── timeline-section
│   ├── timeline
│   │   └── timeline-item × N
│   └── activity-card (versión compacta)
│
├── collection-section
│   ├── collection-grid
│   │   └── collection-card × N
│   └── collection-empty
│
├── quick-actions
│   └── quick-action-card × 6
│
├── recommendation-widget
│   └── recommendation-card × 3
│
└── settings-section
    └── settings-accordion × 5
```

### 7.3 Inputs / Outputs (arquitectura Signals)

```typescript
// Ejemplo de contrato para cada componente standalone

@Component({ standalone: true, ... })
class ProfileHero {
  // Inputs
  user: Signal<UserProfile | null>     // Datos del usuario
  level: Signal<UserLevel>             // Nivel actual
  progress: Signal<LevelProgress>      // Progreso hacia siguiente nivel
  lastPurchase: Signal<Date | null>    // Última compra
  totalSaved: Signal<number>           // Total ahorrado
  totalOrders: Signal<number>          // Total pedidos
  loading: Signal<boolean>             // Estado de carga

  // Outputs
  avatarChange: OutputEmitter<File>    // Nueva foto seleccionada
}

@Component({ standalone: true, ... })
class InsightCard {
  // Inputs
  icon: Signal<string>                 // Ícono del insight
  label: Signal<string>                // "Marca favorita"
  value: Signal<string | number>       // "Nike"
  loading: Signal<boolean>             // Skeleton mode
}

@Component({ standalone: true, ... })
class Timeline {
  // Inputs
  items: Signal<TimelineEvent[]>       // Array de eventos
  loading: Signal<boolean>             // Estado de carga
  empty: Signal<boolean>               // Estado vacío
  
  // Outputs
  itemClick: OutputEmitter<string>     // Click en evento específico
}

@Component({ standalone: true, ... })
class CollectionCard {
  // Inputs
  product: Signal<OrderItem>           // Producto comprado
  // Outputs
  buyAgain: OutputEmitter<string>      // Reordenar
  viewSimilar: OutputEmitter<string>   // Ver similares
  share: OutputEmitter<string>         // Compartir
}
```

---

## 8. Responsive

### 8.1 Estrategia Mobile First

| Breakpoint | Columnas Hero | Grid Insights | Timeline | Colección | Acciones | Recomendaciones |
|---|---|---|---|---|---|---|
| < 480px | Stack vertical | 2 cols | Normal (compacto) | 2 cols | 2 cols | 2 cols |
| 480-768px | Stack vertical | 2 cols | Normal | 2 cols | 2 cols | 2 cols |
| 768-1024px | Hero más horizontal | 3 cols | Normal | 3 cols | 3 cols | 3 cols |
| > 1024px | 100vh centrado | 3 cols | Normal + más espaciado | 3 cols | 3 cols | 3 cols |

### 8.2 Transformaciones Mobile

**Hero (mobile):**
- Avatar: 80px (vs 120px desktop)
- Nombre: 24px (vs 48px)
- Metadata en una línea
- Stats se simplifican: solo "12 pedidos • $350 ahorrados"

**Timeline (mobile):**
- Misma línea vertical pero con padding reducido
- Texto más compacto
- Fechas relativas cortas ("3d" en vez de "Hace 3 días")

**Colección (mobile):**
- Grid 2 columnas
- Hover no aplica (usar tap + menú contextual o botones siempre visibles)

**Acciones (mobile):**
- Grid de 2 columnas
- Cards más pequeñas con solo ícono + label corto

**Configuración (mobile):**
- Acordeones full-width

### 8.3 Touch Targets

- Todos los botones: mínimo 44x44px
- Timeline items: área táctil completa del item
- QuickActionCard: card completa es clickeable
- CollectionCard: toda la tarjeta + botones hover visibles en tap

---

## 9. Microinteracciones

### 9.1 Catálogo de Microinteracciones

| Interacción | Descripción | Timing | Easing |
|---|---|---|---|
| **Page Enter** | Todo el Hero entra con fade-in + translateY(20px → 0) | 600ms | ease-out |
| **Avatar Hover** | Círculo se escala 1.05, lápiz aparece con opacity 0→1 + scale 0.8→1 | 200ms | ease-in-out |
| **Avatar Change** | Foto actual se desvanece, nueva foto hace fade-in + scale bounce suave | 400ms | ease |
| **Card Hover (Insight)** | Elevación pasa de 2 a 8, fondo se aclara 2% | 200ms | ease |
| **Card Hover (Collection)** | Escala 1.02, overlay aparece con blur al fondo | 300ms | ease |
| **Timeline Item Enter** | Al hacer scroll, cada item aparece con fade-in + slide-in-left secuencial | 400ms c/u | ease-out |
| **Quick Action Hover** | Ícono se mueve 2px hacia arriba, fondo cambia de color | 200ms | ease |
| **Settings Accordion** | Flecha rota 180°, contenido se expande con max-height animation | 300ms | ease-in-out |
| **Level Up** | Confetti sutil desde el badge, barra de progreso se anima al nuevo nivel, badge brilla | 1200ms | ease |
| **Like/Wishlist** | Corazón late (scale 1→1.3→1) + color cambia | 300ms | ease |
| **Modal Open** | Backdrop fade-in (300ms), modal scale-in (400ms) | 300-400ms | ease-out |
| **Skeleton Pulse** | Gradient animation left-to-right | 1500ms loop | linear |
| **Error Shake** | Input o card se sacude horizontalmente | 300ms | ease-in-out |
| **Empty State** | Ilustración aparece con fade-in + float suave continuo | 600ms + continuous | ease |
| **Scroll Progress** | Barra del nivel se actualiza suavemente con scroll-based animation | match scroll | linear |

### 9.2 Implementación con Framer Motion / Angular Animations

```typescript
// Patrón de animación (Angular Animation — para referencia arquitectónica)

const pageEnter = trigger('pageEnter', [
  transition(':enter', [
    query('.hero-section', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    query('.insight-card', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      stagger(100, animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
    ]),
    query('.timeline-item', [
      style({ opacity: 0, transform: 'translateX(-10px)' }),
      stagger(150, animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })))
    ])
  ])
]);

// Scroll-based animations via IntersectionObserver
const scrollReveal = trigger('scrollReveal', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(30px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);
```

---

## 10. Estados Vacíos

| Componente | Estado Vacío | Mensaje | Ilustración | CTA |
|---|---|---|---|---|
| **Resumen Inteligente** | Nuevo usuario sin historial | "Todavía no tenemos suficientes datos para conocerte. ¡Sigue comprando!" | 📊 con signo de pregunta | "Explorar productos" |
| **Timeline** | Sin actividad | "Tu historia comienza aquí. Tu primera compra será el primer capítulo." | 📖 abierta | "Ir al catálogo" |
| **Colección** | Sin compras | "Tu colección está vacía. ¿Qué esperas para empezar?" | 🖼️ vacía | "Comprar ahora" |
| **Recomendaciones** | Sin datos | "A medida que compres, aprenderemos tus gustos." | 🤖 pensando | "Ver productos" |
| **Wishlist** (via Quick Action) | Sin favoritos | "No has guardado nada en tu wishlist todavía." | ❤️ outline | "Descubrir productos" |
| **Direcciones** (via Quick Action) | Sin direcciones | "No has agregado direcciones de envío." | 📍 | "Agregar dirección" |
| **Configuración > Notificaciones** | Sin preferencias | "No has configurado tus notificaciones." | 🔔 | "Configurar ahora" |

### Principios de Estados Vacíos

- Nunca mostrar una pantalla en blanco
- Siempre incluir una ilustración o emoji grande
- El texto debe ser amigable, no técnico
- Incluir CTA que guíe al usuario a la siguiente acción
- Animación sutil en la ilustración (float o pulse)

---

## 11. Estados de Carga

### 11.1 Skeleton Design

```
[SkeletonHero]
┌────────────────────────────────────────────────┐
│                                                │
│               ┌──────────┐                    │
│               │ ░░░░░░░░ │ ← Círculo pulsante  │
│               │ ░░░░░░░░ │                    │
│               └──────────┘                    │
│                                                │
│         ██████████████████████████             │ ← Línea pulsante (nombre)
│         ████████████                          │ ← Línea más corta (correo)
│                                                │
│    ████████      ██████████████████            │
│    ████████      ██████████████████            │
└────────────────────────────────────────────────┘

[SkeletonInsights]
┌─────────┐ ┌─────────┐ ┌─────────┐
│ ░░░░░░  │ │ ░░░░░░  │ │ ░░░░░░  │
│ ░░░░░░  │ │ ░░░░░░  │ │ ░░░░░░  │
│ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │
└─────────┘ └─────────┘ └─────────┘

[SkeletonTimeline]
● ████████████████████
● ██████████████
● ████████████████████████
● ██████████
● ████████████████████
```

### 11.2 Timing de carga

| Estado | Duración simulada | UX |
|---|---|---|
| Hero | 400ms | Skeleton hasta que user data carga |
| Insights | 500ms | Skeleton grid |
| Timeline | 600ms | Skeleton items |
| Colección | 500ms | Skeleton grid |
| Recomendaciones | 400ms | Skeleton cards |
| Configuración | 0ms | Sin skeleton (datos estáticos o lazy) |

### 11.3 Principios

- **Content-first:** Mostrar skeleton de la estructura, no spinner
- **Stagger:** Los skeletons aparecen en orden (Hero primero, luego Insights, etc.)
- **Transición suave:** Skeleton → contenido real con fade
- **No spinners** excepto en acciones puntuales (guardar, eliminar)

---

## 12. Estados de Error

| Componente | Error | Mensaje | Acción |
|---|---|---|---|
| **Hero** | No carga usuario | "No pudimos cargar tus datos." | "Reintentar" |
| **Insights** | No cargan insights | "No pudimos analizar tus compras." | "Reintentar" |
| **Timeline** | No carga actividad | "No pudimos cargar tu actividad." | "Reintentar" |
| **Colección** | No carga colección | "No pudimos cargar tu colección." | "Reintentar" |
| **Recomendaciones** | No cargan recomendaciones | "No pudimos generar recomendaciones." | "Reintentar" |
| **Avatar upload** | Archivo inválido | "Formato no soportado. Usa JPG, PNG o WebP." | "Elegir otro archivo" |
| **Avatar upload** | Archivo muy grande | "La imagen es demasiado grande. Máximo 5MB." | "Elegir otro archivo" |
| **Save profile** | Error al guardar | "No pudimos guardar los cambios." | "Reintentar" |
| **Network offline** | Sin conexión | "Parece que no tienes conexión a internet." | "Reintentar" |

### UX de errores

- **Inline > Modal:** Los errores deben aparecer cerca del elemento afectado
- **Toast para errores no bloqueantes:** "No pudimos cargar las recomendaciones" con CTA "Reintentar"
- **Full-screen solo para errores críticos:** Si el Hero no carga, mostrar estado de error con reintentar
- **El error nunca debe romper el layout:** Los skeletons fallback deben mantener la estructura

---

## 13. Accesibilidad

### 13.1 WCAG 2.1 AA Compliance

| Principio | Implementación |
|---|---|
| **Perceivable** | Texto alternativo en avatares e imágenes. Contraste mínimo 4.5:1. Íconos con aria-label |
| **Operable** | Navegación completa por teclado. Timeline y acordeones con arrow keys. Skip to content |
| **Understandable** | Lenguaje claro en mensajes. Estados de error descriptivos. Instrucciones en empty states |
| **Robust** | Semántica HTML correcta (landmarks, headings, lists). ARIA attributes donde sea necesario |

### 13.2 Prácticas específicas

| Componente | Accesibilidad |
|---|---|
| **Avatar** | `role="img"`, `aria-label="Foto de perfil de [nombre]"` |
| **AvatarUploader** | `role="button"`, `tabindex="0"`, `aria-label="Cambiar foto de perfil"` |
| **LevelProgress** | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label="Progreso a nivel [nombre]"` |
| **Timeline** | `role="list"`, cada item `role="listitem"` |
| **TimelineItem** | `aria-label="[acción]: [descripción]"` |
| **CollectionGrid** | `role="list"`, `aria-label="Colección de productos"` |
| **QuickActions** | `role="navigation"`, `aria-label="Acciones rápidas"` |
| **SettingsAccordion** | `role="button"`, `aria-expanded`, `aria-controls` |
| **Modal (cualquier)** | `role="dialog"`, `aria-modal="true"`, focus trap, close on Escape |
| **Skeleton** | `aria-hidden="true"`, `role="presentation"` |
| **Live regions** | `aria-live="polite"` para updates de carga, `aria-live="assertive"` para errores |

### 13.3 Keyboard Navigation

| Tecla | Acción |
|---|---|
| Tab | Navegar entre secciones |
| Shift + Tab | Navegar hacia atrás |
| Enter / Space | Activar botón, abrir acordeón, seleccionar |
| Escape | Cerrar modal, cerrar menú |
| Arrow Down | Siguiente item en timeline (focus mode) |
| Arrow Up | Anterior item en timeline |
| Arrow Left/Right | Navegar entre productos en recomendaciones |

---

## 14. Design Tokens

### 14.1 Color Tokens

```scss
// === LIGHT MODE ===
:root {
  // Background
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F8F9FA;
  --color-bg-tertiary: #F0F1F3;
  --color-bg-elevated: #FFFFFF;
  --color-bg-accent: #EEF2FF;
  
  // Text
  --color-text-primary: #0A0A0B;
  --color-text-secondary: #6B7280;
  --color-text-tertiary: #9CA3AF;
  --color-text-inverse: #FFFFFF;
  --color-text-accent: #4F46E5;
  
  // Border
  --color-border-default: #E5E7EB;
  --color-border-subtle: #F3F4F6;
  --color-border-accent: #4F46E5;
  
  // Accent (Indigo — primary brand)
  --color-accent-50: #EEF2FF;
  --color-accent-100: #E0E7FF;
  --color-accent-200: #C7D2FE;
  --color-accent-500: #6366F1;
  --color-accent-600: #4F46E5;
  --color-accent-700: #4338CA;
  
  // Semantic
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
  
  // Levels
  --color-level-bronze: #CD7F32;
  --color-level-silver: #C0C0C0;
  --color-level-gold: #FFD700;
  --color-level-platinum: #E5E4E2;
  --color-level-diamond: #B9F2FF;
  
  // Shadows
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

// === DARK MODE ===
[data-theme="dark"] {
  --color-bg-primary: #0A0A0B;
  --color-bg-secondary: #141416;
  --color-bg-tertiary: #1C1C1E;
  --color-bg-elevated: #1C1C1E;
  --color-bg-accent: rgba(79, 70, 229, 0.15);
  
  --color-text-primary: #F9FAFB;
  --color-text-secondary: #9CA3AF;
  --color-text-tertiary: #6B7280;
  --color-text-inverse: #0A0A0B;
  --color-text-accent: #818CF8;
  
  --color-border-default: #2D2D30;
  --color-border-subtle: #1C1C1E;
  --color-border-accent: #6366F1;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.5);
}
```

### 14.2 Spacing Tokens

```scss
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  
  // Section padding
  --section-padding-y: var(--space-16);
  --section-padding-x: var(--space-6);
}
```

### 14.3 Border Radius Tokens

```scss
:root {
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
  
  // Component radius
  --radius-card: var(--radius-lg);
  --radius-avatar: var(--radius-full);
  --radius-button: var(--radius-md);
  --radius-modal: var(--radius-xl);
  --radius-badge: var(--radius-full);
  --radius-input: var(--radius-md);
}
```

### 14.4 Typography Tokens

```scss
:root {
  // Font families
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  // Font sizes
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;
  --text-5xl: 48px;
  --text-6xl: 60px;
  
  // Line heights
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  
  // Font weights
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  
  // Component typography
  --hero-name-size: var(--text-5xl);
  --hero-name-weight: var(--weight-bold);
  --hero-email-size: var(--text-base);
  --section-title-size: var(--text-2xl);
  --section-title-weight: var(--weight-semibold);
  --card-title-size: var(--text-sm);
  --card-value-size: var(--text-xl);
  --card-label-size: var(--text-xs);
}
```

### 14.5 Elevation Tokens

```scss
:root {
  --elevation-flat: 0 0 0 0 transparent;
  --elevation-1: 0 1px 2px rgba(0, 0, 0, 0.05);
  --elevation-2: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
  --elevation-3: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
  --elevation-4: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --elevation-5: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  
  // Card elevations
  --card-default: var(--elevation-1);
  --card-hover: var(--elevation-3);
  --card-active: var(--elevation-2);
  
  // Modal
  --modal-backdrop: rgba(0, 0, 0, 0.5);
  --modal-elevation: var(--elevation-5);
}
```

---

## 15. Roadmap MVP → V2 → V3

### MVP (Fase 1) — "My Space"

**Objetivo:** Lanzar un dashboard personal que sorprenda y sea funcional.

| Feature | Prioridad | Esfuerzo | Impacto |
|---|---|---|---|
| Hero con avatar, nombre, nivel, stats | P0 | Medio | Alto |
| Resumen Inteligente (6 cards) | P0 | Bajo | Alto |
| Timeline de actividad | P0 | Medio | Alto |
| Colección visual (grid de compras) | P0 | Medio | Alto |
| Acciones Rápidas (6 cards) | P0 | Bajo | Medio |
| Configuración en acordeones | P0 | Medio | Medio |
| Light/Dark mode | P0 | Bajo | Alto |
| Responsive Mobile | P0 | Alto | Alto |
| Skeletons (hero, insights, timeline, collection) | P0 | Medio | Alto |
| Empty states (insights, timeline, collection) | P0 | Medio | Alto |
| Error states básicos | P0 | Bajo | Medio |
| Avatar upload | P0 | Medio | Alto |

**MVP NO incluye:**
- ❌ Recomendaciones IA (V2)
- ❌ Confetti level up (V2)
- ❌ Animaciones scroll-reveal complejas (V2)
- ❌ Compartir colección (V3)
- ❌ Integración con redes sociales (V3)
- ❌ Análisis avanzados (V3)

### V2 (Fase 2) — "Smart Space"

| Feature | Esfuerzo | Impacto |
|---|---|---|
| Recomendaciones IA con personalización real | Alto | Alto |
| Confetti y animaciones de level up | Medio | Medio |
| Scroll-reveal animations (IntersectionObserver) | Medio | Alto |
| Compartir perfil/nivel en redes | Bajo | Medio |
| Logros y badges adicionales | Medio | Alto |
| Reporte mensual "Tu resumen Hölnex" | Alto | Alto |
| Modo compacto (densidad reducida) | Bajo | Medio |
| Wishlist en la colección (productos guardados) | Medio | Alto |
| Filtros en colección (por año, categoría, precio) | Medio | Medio |
| Notificaciones in-app de actividad | Alto | Medio |

### V3 (Fase 3) — "Connected Space"

| Feature | Esfuerzo | Impacto |
|---|---|---|
| Perfil público (compartible) | Alto | Alto |
| Comparativa con otros usuarios (con permiso) | Alto | Medio |
| Integración con redes sociales | Medio | Medio |
| Análisis avanzados (gastos por mes, categoría) | Alto | Alto |
| Wishlist pública para regalos | Medio | Medio |
| Suscripción a marcas favoritas | Medio | Alto |
| Reviews con fotos del usuario en su perfil | Alto | Alto |
| Dashboard de devoluciones y reembolsos | Medio | Medio |
| Exportar datos del perfil (GDPR) | Medio | Bajo |
| Personalización de tema (colores del usuario) | Alto | Alto |

---

## 16. Autocrítica: 10+ Oportunidades de Mejora

Tras diseñar el concepto completo, identifico las siguientes debilidades y áreas de mejora:

### Crítica 1: El Hero consume demasiado espacio vertical
**Problema:** 100vh para el Hero significa que el usuario debe scrollear para ver el contenido real. En mobile esto es crítico.
**Mejora:** Reducir Hero a 60-70vh en desktop y 40-50vh en mobile. O permitir scroll temprano con el contenido que aparece bajo el fold.

### Crítica 2: El Resumen Inteligente depende de datos de compras
**Problema:** Para usuarios nuevos o con pocas compras, los insights serán pobres o incorrectos, generando decepción.
**Mejora:** Implementar un sistema de "aprendizaje gradual" donde los insights se muestren con nivel de confianza. "Basado en tus últimas 3 compras: parece que te gusta Nike."

### Crítica 3: La Timeline puede volverse ruidosa
**Problema:** Con muchos eventos (calificaciones, favoritos, compras), la timeline puede saturarse.
**Mejora:** Agrupar eventos similares ("Compraste 3 productos" en vez de 3 eventos separados). Permitir filtrar por tipo de evento.

### Crítica 4: Las Acciones Rápidas compiten con la navegación global
**Problema:** El ecommerce ya tiene un navbar superior. Las Acciones Rápidas pueden crear duplicación de navegación.
**Mejora:** Las Acciones Rápidas deben ser accesos directos a funcionalides de *perfil*, no de navegación general. Diferenciar claramente: perfil (editar, dirección, seguridad) vs ecommerce (catálogo, carrito).

### Crítica 5: La Configuración al fondo puede ser difícil de encontrar
**Problema:** Usuarios acostumbrados a la configuración arriba o en sidebar pueden frustrarse.
**Mejora:** Incluir un botón flotante "⚙️" en la esquina superior derecha que haga scroll suave hasta la configuración. O un link "Ir a configuración" en el Hero.

### Crítica 6: La galería de colección requiere imágenes de alta calidad
**Problema:** Si los productos tienen imágenes de baja calidad o inconsistentes, la galería se verá mal.
**Mejora:** Exigir imágenes 1:1 en el catálogo. Usar placeholder elegante mientras carga. Considerar un "modo lista" como alternativa.

### Crítica 7: Las microinteracciones pueden ser costosas de implementar
**Problema:** Animaciones suaves requieren trabajo extra y pueden impactar rendimiento en dispositivos de gama baja.
**Mejora:** Priorizar animaciones que aportan valor funcional (skeleton, entrada de página) sobre las decorativas. Usar `prefers-reduced-motion` para desactivar animaciones.

### Crítica 8: La ausencia de un sidebar puede desorientar en mobile
**Problema:** Los usuarios están condicionados a buscar navegación en sidebar/hamburger. Sin él, pueden senterse perdidos.
**Mejora:** Incluir un indicador visual de scroll (barra de progreso) y un menú sticky superior con las secciones como pills: "Resumen · Actividad · Colección · Ajustes".

### Crítica 9: El concepto de "nivel" puede sentirse forzado
**Problema:** En un ecommerce, la gamificación sin contexto real puede parecer artificial.
**Mejora:** Vincular los niveles a beneficios reales (envío gratis, descuentos exclusivos, acceso anticipado). El nivel debe tener valor tangible.

### Crítica 10: La página única con scroll puede ser lenta con muchos datos
**Problema:** Un usuario con 50 pedidos, 200 favoritos y 2 años de actividad tendrá una página masiva.
**Mejora:** Lazy loading de secciones. "Ver más" en timeline y colección. Virtual scroll si es necesario. Cada sección carga independientemente.

### Crítica 11: Falta de personalización visual
**Problema:** Aunque el contenido es personalizado, el layout es el mismo para todos.
**Mejora:** Permitir que el usuario reorganice las secciones (drag & drop) o seleccione qué secciones ver primero. Como Notion dashboard.

### Crítica 12: El dark mode puede aumentar la complejidad de desarrollo
**Problema:** Soportar dark mode en todos los componentes duplica el trabajo de estilos.
**Mejora:** Usar CSS custom properties desde el inicio. No implementar dark mode como feature separado sino como token nativo del sistema.

### Conclusión de la autocrítica

El diseño propuesto es **ambicioso pero realista** para un MVP. Las críticas 1, 4, 5 y 6 deben abordarse **antes** del MVP. Las críticas 2, 3, 8, 9 y 10 son mejoras para V2/V3. Las críticas 11 y 12 son consideraciones arquitectónicas a largo plazo.

**El MVP debe sentirse completo, no como un trabajo en progreso.** Cada sección debe funcionar impecablemente aunque tenga pocos datos. La calidad sobre la cantidad es el principio rector.

---

## Resumen Final

"**My Space**" no es un perfil de ecommerce. Es un **dashboard personal** que convierte la relación usuario-marca en una experiencia visual, inteligente y emocional.

### Lo que hace único a este diseño:

1. **Hero cinematográfico** — El usuario se siente el protagonista
2. **Insights inteligentes** — La marca conoce al usuario
3. **Timeline narrativa** — La historia viva del usuario
4. **Colección visual** — Las compras son posesiones, no datos
5. **Sin sidebar** — Navegación limpia sin obstáculos
6. **Configuración al fondo** — Lo importante primero
7. **Gamificación elegante** — Niveles con beneficios reales
8. **Responsive nativo** — Mobile First real
9. **Microinteracciones** — Cada interacción es un delight
10. **Design tokens** — Sistema visual consistente y escalable

**El objetivo se cumple: el usuario querrá entrar a su perfil aunque no necesite cambiar nada. Porque este espacio es suyo.**