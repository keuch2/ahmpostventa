# PROMPT — Prototipo Visual AHM Postventa (HTML + Tailwind CSS)

---

Crea un prototipo visual completo de un portal web de postventa automotriz para **Honda Paraguay — VICAR S.A.**, en un único archivo HTML autocontenido. El diseño debe ser **visualmente idéntico** al portal **Honda MyGarage** (https://mygarage.honda.com), adaptado al mercado paraguayo, en **español**, con los colores, tipografía y UX exactos de Honda.

---

## IDENTIDAD DE MARCA

- **Nombre del portal:** VICAR | Honda Paraguay — Mi Garaje
- **Marca:** Honda Paraguay — VICAR S.A.
- **Slogan Honda:** "The Power of Dreams"
- **Colores principales:**
  - Rojo Honda: `#CC0000`
  - Negro header: `#1A1A1A` (igual que honda.com)
  - Blanco fondo: `#FFFFFF`
  - Gris claro secciones: `#F5F5F5`
  - Gris texto secundario: `#767676`
  - Rojo hover: `#AA0000`
- **Tipografía:** font-family `'Honda Sans', Arial, sans-serif` (usar Arial como fallback)
- **Logo:** Usa el texto estilizado "H" en un cuadrado rojo `#CC0000` como SVG inline, seguido de "VICAR" en negro y "Honda Paraguay" debajo en gris.

---

## ESPECIFICACIONES TÉCNICAS

- **Un solo archivo HTML** autocontenido (sin dependencias externas excepto Tailwind CDN y Font Awesome CDN)
- **Tailwind CSS** vía CDN (`https://cdn.tailwindcss.com`)
- **Font Awesome 6** para iconos (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css`)
- **JavaScript puro** (vanilla JS) para interactividad, sin frameworks
- Completamente **responsivo** (mobile-first)
- **Sin backend real** — todos los datos son mock/ficticios hardcodeados en JS
- Idioma: **español paraguayo** (usar "Guardar en Mi Garaje", "Buscar concesionario", etc.)

---

## PÁGINAS / SECCIONES A IMPLEMENTAR

Implementa todas las siguientes secciones como vistas que se muestran/ocultan con JavaScript (SPA simulada), sin recargar la página.

---

### VISTA 1: HEADER GLOBAL (presente en todas las vistas)

Replica exactamente el header de honda.com:
- **Barra superior muy delgada** (negro `#1A1A1A`) con texto pequeño: "Llame al 021-XXX-XXXX | Lunes a Viernes 8:00 - 17:00"
- **Header principal blanco** con:
  - Logo VICAR / Honda Paraguay a la izquierda
  - Navegación horizontal: `VEHÍCULOS ▼` | `HERRAMIENTAS DE COMPRA ▼` | **`Propietarios ▼`** (este activo/resaltado) | `Explorar ▼` | `Buscar concesionario`
  - Ícono de búsqueda (lupa) y selector de idioma `ES ▼` a la derecha
  - El ítem "Propietarios" muestra un mega-menú dropdown al hover con dos columnas:
    - Columna izquierda: "Mi garaje | Propietarios", "Manual del usuario y garantías", "Programar servicio técnico", "Comprar piezas y accesorios", "Buscador de talleres certificados"
    - Columna derecha: "Asistencia en carretera", "Pagar mi factura", "Retiros del mercado", "Servicio al cliente"
    - Cada ítem con ícono de enlace externo `↗`

---

### VISTA 2: BÚSQUEDA DE VEHÍCULO (página principal / landing)

Replica exactamente la página `https://mygarage.honda.com/s/find-honda`:

**Sección superior — Hero:**
- Fondo blanco limpio
- Título izquierda: `ACCEDE A TU INFORMACIÓN` (gris pequeño, uppercase)
- Subtítulo grande: `Encuentra tu Honda` (negro, ~36px bold)
- Párrafo descriptivo: "Ingresa la información de tu vehículo para obtener consejos útiles para su mantenimiento o inicia sesión en Mi Garaje para una experiencia más personalizada."
- Formulario con 3 selectores en línea: **Año** | **Modelo** | **Trim** + botón rojo `BUSCAR`
- Divisor `— O —` centrado
- Campo VIN con label: "Ingresa tu número de VIN para obtener detalles personalizados de tu vehículo."
- Label `NÚMERO DE VIN ⓘ` + input grande + botón `BUSCAR` en rojo
- Imagen decorativa del Honda CR-V 2018 blanco a la derecha (usa un rectángulo gris como placeholder con el texto "Honda CR-V 2018")

**Sección inferior — "¿Qué deseas hacer hoy?":**
- 4 tarjetas en grid 2x2 (o 4 en fila desktop) con ícono, título y descripción:
  1. 🔧 **Programar servicio** — "Agenda tu próximo mantenimiento con un taller certificado Honda"
  2. ⚠️ **Retiros del mercado** — "Verifica si tu vehículo tiene recalls activos"
  3. 📖 **Manual del usuario** — "Accede al manual de tu Honda por año y modelo"
  4. 🛒 **Comprar repuestos** — "Encuentra piezas y accesorios Honda genuinos"

---

### VISTA 3: MI GARAJE (dashboard del cliente autenticado)

Se activa al hacer clic en "Iniciar sesión" o "Buscar" (simular login automático con datos mock).

**Header de sección:**
- Saludo: "Bienvenido, José Agüero"
- Subtítulo: "Gestiona tus vehículos Honda"

**Tarjeta de vehículo (My Products):**
Mostrar 1 vehículo mock con diseño tipo tarjeta:
```
┌─────────────────────────────────────────────┐
│  [Imagen Honda CR-V 2018 — rectángulo gris] │
│  Honda CR-V 2018 AWD EX                     │
│  VIN: 2HKRW2H8XJH123456                    │
│  ⚠️ 3 recalls activos — Ver ahora          │  ← Badge rojo
│  [AGREGAR A MI GARAJE]  [VER DETALLES]      │
└─────────────────────────────────────────────┘
```

**Sidebar derecho:** "Mis Productos" con un ícono de auto gris (placeholder del vehículo).

**Barra de navegación de tabs** debajo de la tarjeta:
`Recalls de Seguridad` | `Mantenimiento` | `Manual de Usuario` | `Historial`

---

### VISTA 4: RECALLS / RETIROS DEL MERCADO

Tab activo desde Mi Garaje o acceso desde búsqueda por VIN.

**Banner de alerta:**
```
┌────────────────────────────────────────────────────────┐
│ ⚠️  Hay 3 recalls activos para tu 2018 CR-V.           │
│     Ver ahora y tomar acción.                          │  ← fondo amarillo claro
└────────────────────────────────────────────────────────┘
```

**Encabezado:** "Recalls de Seguridad — Honda CR-V 2018"
Párrafo: "Este sitio proporciona información sobre retiros del mercado anunciados en los últimos 15 años calendario. (Actualizado: 18/02/2026). Por favor contacte un concesionario Honda autorizado para programar una cita."

**Lista de 3 recalls mock** (diseño tipo tarjeta expandible):

**Recall 1 — ESTADO: PENDIENTE** (badge rojo)
- Título: "Componente de solenoide de la bomba de alta presión dañado"
- Código campaña fábrica: `SYP` | Boletín: `0808/25`
- Descripción: "El componente de solenoide de la bomba de alta presión puede estar dañado, lo que puede causar pérdida de potencia del motor o dificultades para arrancar."
- VIN: ✓ Aplica a tu vehículo
- Botón: `PROGRAMAR CITA` (rojo)

**Recall 2 — ESTADO: PENDIENTE** (badge rojo)
- Título: "Inflador del airbag del conductor puede romperse"
- Código: `TAKATA-01`
- Descripción: "El inflador del airbag puede romperse y proyectar fragmentos metálicos."
- Botón: `PROGRAMAR CITA` (rojo)

**Recall 3 — ESTADO: REALIZADO** (badge verde)
- Título: "Actualización de software del sistema de frenos ABS"
- Fecha realización: "12/06/2025" | OT: `1019067`
- Taller: VICAR S.A. — Sucursal Central

---

### VISTA 5: KIT DE SERVICE / MANTENIMIENTO

Tab "Mantenimiento" desde Mi Garaje.

**Encabezado:** "Mantenimiento Programado — Honda CR-V 2018"

**Input de kilometraje:**
```
Tu kilometraje actual: [  45,000  km ]  [CONSULTAR]
```

**Timeline visual de mantenimientos** (barra horizontal con puntos):
```
✅ 5.000 km  ✅ 10.000 km  ✅ 20.000 km  ✅ 30.000 km  ✅ 40.000 km  → 📍 50.000 km  ○ 60.000 km
```

**Próximo service destacado** (tarjeta con borde rojo):
```
┌──────────────────────────────────────────────────────────────┐
│  🔧 MANTENIMIENTO 50.000 KM                                  │
│  Próximo a los 50,000 km  (Faltan ~5,000 km)                │
│                                                              │
│  DETALLE DE PRODUCTOS                                        │
│  ├ Aceite motor 0W-20 SHPAHELIX ULTRA 4L .... Gs 420,000    │
│  ├ Aditivo limpieza HMJA0200P93G8YD1 ........ Gs 180,000    │
│  ├ Solución acuosa limpiaparabrisas ......... Gs 10,000     │
│  ├ Arandela HMJA9410914000 .................. Gs 4,000      │
│  └ Agua destilada 1L (x2) .................. Gs 8,000       │
│  TOTAL PRODUCTOS:                              Gs 622,000    │
│                                                              │
│  SERVICIOS / MANO DE OBRA                                    │
│  └ Servicio Mantenimiento 1 (100 min) ....... Gs 150,000    │
│  TOTAL SERVICIO:                               Gs 150,000    │
│                                                              │
│  TOTAL ESTIMADO:                               Gs 772,000    │
│                                                              │
│  [AGENDAR CITA DE MANTENIMIENTO]   ← botón rojo grande      │
└──────────────────────────────────────────────────────────────┘
```

---

### VISTA 6: AGENDAR CITA

Se activa al hacer clic en cualquier botón "PROGRAMAR CITA" o "AGENDAR CITA".

**Formulario limpio:**
- Título: "Agendar Servicio Técnico"
- Vehículo: dropdown pre-seleccionado "Honda CR-V 2018 — VIN 2HKRW2H8XJH123456"
- Tipo de servicio: dropdown opciones [Mantenimiento programado | Recall / Retiro del mercado | Reparación general | Inspección]
- Sucursal: dropdown [VICAR Central — Av. España 123 | VICAR San Lorenzo | VICAR Encarnación]
- Fecha deseada: date picker
- Horario: radio buttons [08:00 | 09:00 | 10:00 | 11:00 | 14:00 | 15:00 | 16:00]
- Kilometraje actual: número
- Comentarios: textarea
- Botón grande rojo: `SOLICITAR CITA`

**Confirmación (mostrar al hacer submit):**
```
✅ ¡Solicitud enviada con éxito!
Nro de solicitud: #2026-04-1842
Te contactaremos a jose.aguero@email.com para confirmar tu cita.
```

---

### VISTA 7: FOOTER GLOBAL

Replica exactamente el footer de honda.com:
- Fondo negro `#1A1A1A`
- Logo Honda blanco a la izquierda
- 4 columnas de links: Vehículos | Propietarios | Compra | Empresa
- Barra inferior con: © 2026 Honda Paraguay - VICAR S.A. | Privacidad | Términos | Mapa del sitio

---

## NAVEGACIÓN Y INTERACTIVIDAD

Implementa en JavaScript puro:

1. **Navbar mega-menú:** Dropdown animado al hover en "Propietarios ▼"
2. **Búsqueda por VIN:** Al hacer clic en "BUSCAR" con cualquier VIN, navegar a Vista 4 (Recalls)
3. **Búsqueda por selectores:** Al seleccionar Año + Modelo + hacer clic en BUSCAR, navegar a Vista 5 (Kit de Service)
4. **Botón "Iniciar sesión"** (que aparece en header): Al hacer clic, simular login y mostrar Vista 3 (Mi Garaje)
5. **Tabs en Mi Garaje:** Cambiar entre Recalls / Mantenimiento / Manual / Historial
6. **Botones "PROGRAMAR CITA":** Navegar a Vista 6 (Agendar Cita)
7. **Submit del formulario de cita:** Mostrar mensaje de confirmación
8. **Botones "CONSULTAR" en kilometraje:** Actualizar la vista del timeline y el próximo service

---

## CALIDAD VISUAL ESPERADA

- El prototipo debe ser **indistinguible visualmente** de `mygarage.honda.com` para alguien que lo vea en pantalla
- Todas las animaciones/transiciones suaves con `transition-all duration-200`
- Sombras sutiles en tarjetas: `shadow-sm hover:shadow-md`
- Bordes redondeados consistentes: `rounded-sm` para elementos Honda (Honda usa esquinas muy suaves)
- El botón rojo Honda debe ser exactamente `bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-8 py-3`
- Los enlaces del menú deben ser: `text-sm font-medium text-gray-700 hover:text-red-600`
- El estilo de las tarjetas de vehículo debe imitar exactamente el de MyGarage: imagen centrada en círculo blanco con sombra, nombre del modelo en texto grande negro

---

## DATOS MOCK A USAR

```javascript
const dataMock = {
  cliente: {
    nombre: "José Agüero",
    email: "jose.aguero@email.com",
    telefono: "0981-123-456"
  },
  vehiculo: {
    vin: "2HKRW2H8XJH123456",
    matricula: "ABC-123",
    modelo: "Honda CR-V 2018 AWD EX w/Leather CVT",
    anio: 2018,
    color: "Blanco Platino",
    kilometraje: 45000
  },
  recalls: [
    { id: "SYP", titulo: "Solenoide bomba alta presión", estado: "pendiente", boletin: "0808/25" },
    { id: "TAKATA-01", titulo: "Inflador airbag conductor", estado: "pendiente" },
    { id: "ABS-SW", titulo: "Actualización software ABS", estado: "realizado", fecha: "12/06/2025", ot: "1019067" }
  ],
  kitService: {
    descripcion: "MANTENIMIENTO 50.000 KM",
    kilometraje: 50000,
    productos: [
      { codigo: "SHPAHELIX ULTRA", descripcion: "Aceite motor 0W-20 4L", precio: 420000 },
      { codigo: "HMJA0200P93G8YD1", descripcion: "Aditivo limpieza", precio: 180000 },
      { codigo: "HMJA08798TABS", descripcion: "Solución acuosa limpiaparabrisas", precio: 10000 },
      { codigo: "HMJA9410914000", descripcion: "Arandela", precio: 4000 },
      { codigo: "HMPADESTILADA", descripcion: "Agua destilada 1L x2", precio: 8000 }
    ],
    servicios: [
      { codigo: "HMJASERV1", descripcion: "Servicio Mantenimiento 1", tiempo: 100, precio: 150000 }
    ]
  }
};
```

---

## ENTREGABLE

Un único archivo `index.html` que:
- Funcione al abrirse directamente en el navegador sin servidor
- Contenga TODO el CSS (Tailwind via CDN + estilos custom inline si necesario)
- Contenga TODO el JavaScript de navegación e interactividad
- Sea completamente responsive en mobile (375px) y desktop (1440px)
- Reproduzca fielmente la estética de mygarage.honda.com en español
