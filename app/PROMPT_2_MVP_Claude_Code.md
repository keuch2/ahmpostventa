# PROMPT — Desarrollo del MVP AHM Postventa (para Claude Code)

---

Eres un desarrollador full-stack senior. Debes construir el MVP completo del sistema **AHM Postventa** para **Honda Paraguay — VICAR S.A.**. Este es un sistema de postventa automotriz con dos partes: un **portal de clientes** (estilo Honda MyGarage) y un **panel administrativo** para el equipo de VICAR.

Lee este prompt completo antes de escribir una sola línea de código. Sigue las instrucciones en el orden exacto indicado.

---

## CONTEXTO DEL NEGOCIO

VICAR S.A. es el concesionario oficial de Honda en Paraguay. Actualmente operan con un sistema desktop legacy conectado a SQL Server. El MVP reemplaza ese sistema con una plataforma web moderna.

**Dos módulos principales:**
1. **Campañas / Recalls:** Gestión de retiros de fábrica y campañas de servicio. El administrador carga vehículos afectados (por chasis/VIN) y hace seguimiento del estado (pendiente → realizado → facturado).
2. **Kit de Service:** Combos de mantenimiento preventivo predefinidos por modelo/año/kilometraje, con productos (repuestos), servicios (mano de obra) y tareas de inspección.

---

## STACK TECNOLÓGICO (no negociable)

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 18+ |
| Frontend build | Vite | 5+ |
| Frontend estilos | Tailwind CSS | 3+ |
| Frontend routing | React Router | v6 |
| Frontend data fetching | TanStack Query (React Query) | v5 |
| Frontend forms | React Hook Form + Zod | — |
| Frontend HTTP | Axios | — |
| Frontend iconos | Lucide React | — |
| Backend framework | Laravel | 11 |
| Backend lenguaje | PHP | 8.3+ |
| Backend auth | Laravel Sanctum | — |
| Base de datos | MySQL | 8.0+ |
| Cache / Queues | Redis (o database driver si no disponible) | — |
| Servidor dev | Docker + Docker Compose | — |

---

## ESTRUCTURA DE DIRECTORIOS

Crear la siguiente estructura de proyecto:

```
ahm-postventa/
├── backend/                    # Laravel 11
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Auth/
│   │   │   │   │   └── AuthController.php
│   │   │   │   ├── Api/
│   │   │   │   │   ├── VehiculoController.php
│   │   │   │   │   ├── CampaniaController.php
│   │   │   │   │   ├── KitServiceController.php
│   │   │   │   │   └── CitaController.php
│   │   │   │   └── Admin/
│   │   │   │       ├── DashboardController.php
│   │   │   │       ├── CampaniaAdminController.php
│   │   │   │       ├── KitServiceAdminController.php
│   │   │   │       ├── VehiculoAdminController.php
│   │   │   │       ├── ClienteAdminController.php
│   │   │   │       └── CitaAdminController.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Empresa.php
│   │   │   ├── Cliente.php
│   │   │   ├── Vehiculo.php
│   │   │   ├── Marca.php
│   │   │   ├── Modelo.php
│   │   │   ├── TipoTransmision.php
│   │   │   ├── TipoCombustible.php
│   │   │   ├── Campania.php
│   │   │   ├── CampaniaVehiculo.php
│   │   │   ├── CampaniaArticulo.php
│   │   │   ├── Articulo.php
│   │   │   ├── KitService.php
│   │   │   ├── KitServiceItem.php
│   │   │   └── CitaServicio.php
│   │   ├── Policies/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Button, Input, Card, Modal, Badge, etc.
│   │   │   ├── layout/         # PublicLayout, AdminLayout, Header, Footer, Sidebar
│   │   │   └── shared/         # VehicleCard, RecallBadge, ServiceTimeline
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── HomePage.jsx          # Búsqueda por VIN/modelo
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── cliente/
│   │   │   │   ├── MiGarajePage.jsx      # Dashboard cliente
│   │   │   │   ├── DetalleVehiculoPage.jsx
│   │   │   │   ├── RecallsPage.jsx
│   │   │   │   ├── KitServicePage.jsx
│   │   │   │   └── AgendarCitaPage.jsx
│   │   │   └── admin/
│   │   │       ├── DashboardPage.jsx
│   │   │       ├── campanias/
│   │   │       │   ├── CampaniasListPage.jsx
│   │   │       │   └── CampaniaDetailPage.jsx
│   │   │       ├── kits/
│   │   │       │   ├── KitsListPage.jsx
│   │   │       │   └── KitDetailPage.jsx
│   │   │       ├── vehiculos/
│   │   │       ├── clientes/
│   │   │       └── citas/
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useVehiculo.js
│   │   ├── services/
│   │   │   ├── api.js          # Instancia axios con interceptores
│   │   │   ├── auth.service.js
│   │   │   ├── vehiculo.service.js
│   │   │   ├── campania.service.js
│   │   │   └── kitservice.service.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── formatters.js   # Formato de precios en Guaraníes, fechas
│   │   ├── routes/
│   │   │   └── index.jsx       # Todas las rutas con guards
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── docker-compose.yml
```

---

## PASO 1: DOCKER COMPOSE

Crea `docker-compose.yml` en la raíz con los siguientes servicios:
- `mysql`: MySQL 8.0, puerto 3306, base de datos `ahm_postventa`, usuario `ahm_user`, contraseña `ahm_secret`
- `redis`: Redis 7 Alpine, puerto 6379
- `backend`: PHP 8.3-FPM + Composer, volumen `./backend:/var/www/html`, puerto 8000
- `nginx`: Nginx Alpine, sirve el backend en puerto 80 y el frontend build en puerto 3000
- `frontend`: Node 20 Alpine, `npm run dev`, puerto 5173

Incluye un `nginx.conf` que haga proxy de `/api/*` al backend y sirva el index.html del frontend para todas las demás rutas (SPA fallback).

---

## PASO 2: BASE DE DATOS MYSQL — MIGRACIONES LARAVEL

Crea las migraciones en el orden correcto (respetando foreign keys):

### Migración 1: `create_empresas_table`
```sql
CREATE TABLE empresas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  razon_social VARCHAR(255) NOT NULL,
  ruc VARCHAR(20) NOT NULL UNIQUE,
  direccion VARCHAR(500) NULL,
  telefono VARCHAR(50) NULL,
  email VARCHAR(255) NULL,
  logo_url VARCHAR(500) NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Migración 2: `create_users_table`
```sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NULL,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin','admin','cliente') NOT NULL DEFAULT 'cliente',
  telefono VARCHAR(50) NULL,
  celular VARCHAR(50) NULL,
  email_verified_at TIMESTAMP NULL,
  activo BOOLEAN DEFAULT TRUE,
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 3: `create_marcas_table`
```sql
CREATE TABLE marcas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(500) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 4: `create_modelos_table`
```sql
CREATE TABLE modelos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  marca_id BIGINT UNSIGNED NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  codigo VARCHAR(20) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (marca_id) REFERENCES marcas(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 5: `create_tipo_transmision_table`
```sql
CREATE TABLE tipo_transmision (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 6: `create_tipo_combustible_table`
```sql
CREATE TABLE tipo_combustible (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 7: `create_clientes_table`
```sql
CREATE TABLE clientes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  codigo_cliente VARCHAR(50) NULL,
  razon_social VARCHAR(255) NOT NULL,
  ruc_ci VARCHAR(20) NULL,
  telefono VARCHAR(50) NULL,
  celular VARCHAR(50) NULL,
  celular2 VARCHAR(50) NULL,
  email VARCHAR(255) NULL,
  direccion TEXT NULL,
  cod_sucursal VARCHAR(10) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 8: `create_vehiculos_table`
```sql
CREATE TABLE vehiculos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NOT NULL,
  cliente_id BIGINT UNSIGNED NULL,
  nro_chassis VARCHAR(50) NOT NULL UNIQUE,
  matricula VARCHAR(20) NULL,
  modelo_id BIGINT UNSIGNED NOT NULL,
  anio SMALLINT UNSIGNED NOT NULL,
  carroceria VARCHAR(50) NULL,
  color VARCHAR(50) NULL,
  vds VARCHAR(20) NULL,
  transmision_id BIGINT UNSIGNED NULL,
  combustible_id BIGINT UNSIGNED NULL,
  kilometraje_actual INT UNSIGNED DEFAULT 0,
  fecha_venta DATE NULL,
  imagen_url VARCHAR(500) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX idx_chassis (nro_chassis),
  INDEX idx_matricula (matricula),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  FOREIGN KEY (modelo_id) REFERENCES modelos(id),
  FOREIGN KEY (transmision_id) REFERENCES tipo_transmision(id) ON DELETE SET NULL,
  FOREIGN KEY (combustible_id) REFERENCES tipo_combustible(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 9: `create_articulos_table`
```sql
CREATE TABLE articulos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  cod_linea VARCHAR(20) NULL,
  tipo ENUM('repuesto','servicio','inspeccion') NOT NULL DEFAULT 'repuesto',
  precio DECIMAL(12,2) DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX idx_codigo (codigo),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 10: `create_campanias_table`
```sql
CREATE TABLE campanias (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NOT NULL,
  registro_campania VARCHAR(20) NOT NULL,
  tipo_campania VARCHAR(50) NOT NULL,
  fecha DATE NOT NULL,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  comentario TEXT NULL,
  codigo_fabrica VARCHAR(20) NULL,
  nro_boletin VARCHAR(20) NULL,
  cantidad_vehiculos INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX idx_registro (registro_campania),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 11: `create_campania_vehiculos_table`
```sql
CREATE TABLE campania_vehiculos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  campania_id BIGINT UNSIGNED NOT NULL,
  vehiculo_id BIGINT UNSIGNED NOT NULL,
  fecha_venta DATE NULL,
  numero_ot VARCHAR(20) NULL,
  estado ENUM('pendiente','en_proceso','realizado','facturado') NOT NULL DEFAULT 'pendiente',
  fecha_realizacion DATE NULL,
  fecha_facturacion DATE NULL,
  monto_facturado DECIMAL(12,2) DEFAULT 0,
  observaciones TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY uq_campania_vehiculo (campania_id, vehiculo_id),
  INDEX idx_estado (estado),
  FOREIGN KEY (campania_id) REFERENCES campanias(id) ON DELETE CASCADE,
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 12: `create_campania_articulos_table`
```sql
CREATE TABLE campania_articulos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  campania_id BIGINT UNSIGNED NOT NULL,
  articulo_id BIGINT UNSIGNED NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL DEFAULT 1,
  precio DECIMAL(12,2) DEFAULT 0,
  tipo ENUM('repuesto','mano_obra') NOT NULL DEFAULT 'repuesto',
  FOREIGN KEY (campania_id) REFERENCES campanias(id) ON DELETE CASCADE,
  FOREIGN KEY (articulo_id) REFERENCES articulos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 13: `create_kits_service_table`
```sql
CREATE TABLE kits_service (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NOT NULL,
  codigo_combo VARCHAR(50) NOT NULL,
  modelo_id BIGINT UNSIGNED NOT NULL,
  codigo_grado VARCHAR(20) NULL,
  vds VARCHAR(20) NULL,
  anio_inicio SMALLINT UNSIGNED NOT NULL,
  anio_final SMALLINT UNSIGNED NOT NULL,
  carroceria VARCHAR(50) NULL,
  transmision_id BIGINT UNSIGNED NULL,
  combustible_id BIGINT UNSIGNED NULL,
  tipo_motor VARCHAR(50) NULL,
  kilometraje INT UNSIGNED NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  express BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX idx_codigo_combo (codigo_combo),
  INDEX idx_busqueda (empresa_id, modelo_id, kilometraje),
  FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  FOREIGN KEY (modelo_id) REFERENCES modelos(id),
  FOREIGN KEY (transmision_id) REFERENCES tipo_transmision(id) ON DELETE SET NULL,
  FOREIGN KEY (combustible_id) REFERENCES tipo_combustible(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 14: `create_kit_service_items_table`
```sql
CREATE TABLE kit_service_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kit_service_id BIGINT UNSIGNED NOT NULL,
  articulo_id BIGINT UNSIGNED NOT NULL,
  lista_precio VARCHAR(50) DEFAULT 'PRINCIPAL',
  cantidad DECIMAL(10,2) NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(12,2) NOT NULL DEFAULT 0,
  tiempo_minutos INT DEFAULT 0,
  tipo ENUM('producto','servicio','inspeccion') NOT NULL DEFAULT 'producto',
  FOREIGN KEY (kit_service_id) REFERENCES kits_service(id) ON DELETE CASCADE,
  FOREIGN KEY (articulo_id) REFERENCES articulos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migración 15: `create_citas_servicio_table`
```sql
CREATE TABLE citas_servicio (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NOT NULL,
  cliente_id BIGINT UNSIGNED NOT NULL,
  vehiculo_id BIGINT UNSIGNED NOT NULL,
  kit_service_id BIGINT UNSIGNED NULL,
  campania_vehiculo_id BIGINT UNSIGNED NULL,
  fecha_solicitada DATETIME NOT NULL,
  fecha_confirmada DATETIME NULL,
  tipo_servicio VARCHAR(100) NOT NULL,
  kilometraje INT UNSIGNED NULL,
  comentarios TEXT NULL,
  estado ENUM('solicitada','confirmada','en_proceso','completada','cancelada') DEFAULT 'solicitada',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id),
  FOREIGN KEY (kit_service_id) REFERENCES kits_service(id) ON DELETE SET NULL,
  FOREIGN KEY (campania_vehiculo_id) REFERENCES campania_vehiculos(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## PASO 3: SEEDERS

Crea `DatabaseSeeder.php` que ejecute en orden:

### `EmpresaSeeder`
```php
Empresa::create([
    'razon_social' => 'VICAR S.A.',
    'ruc' => '80012345-1',
    'telefono' => '(021) 600-1234',
    'email' => 'info@vicar.com.py',
    'activo' => true,
]);
```

### `UserSeeder`
Crear 3 usuarios:
- superadmin: `superadmin@vicar.com.py` / `SuperAdmin123!` / role: `superadmin`
- admin: `admin@vicar.com.py` / `Admin123!` / role: `admin`, empresa_id: 1
- cliente de prueba: `cliente@test.com` / `Cliente123!` / role: `cliente`

### `CatalogoSeeder`
- Marca: `Honda`
- Modelos Honda: CR-V, Accord, Civic, Pilot, HR-V, Fit, Odyssey
- Transmisiones: `XAT=Automática XAT`, `CVT=Continuamente Variable CVT`, `MT=Manual`
- Combustibles: `NAFT=Naftero`, `DIES=Diésel`, `HYB=Híbrido`

### `VehiculoSeeder`
2 vehículos de prueba para el cliente de prueba:
```php
[
    'empresa_id' => 1,
    'nro_chassis' => '2HKRW2H8XJH123456',
    'matricula' => 'ABC-123',
    'modelo_id' => /* CR-V */,
    'anio' => 2018,
    'carroceria' => 'AWD EX w/Leather CVT',
    'color' => 'Blanco Platino',
    'kilometraje_actual' => 45000,
    'fecha_venta' => '2018-06-15',
]
```

### `CampaniaSeeder`
1 campaña RECALL activa:
```php
[
    'empresa_id' => 1,
    'registro_campania' => 'SYP1',
    'tipo_campania' => 'RECALL 01',
    'fecha' => '2025-04-07',
    'comentario' => 'COMPONENTE DE SOLENOIDE DE LA BOMBA DE ALTA PRESIÓN DAÑADO',
    'codigo_fabrica' => 'SYP',
    'nro_boletin' => '0808/25',
    'activo' => true,
]
```
Con el vehículo de prueba asignado como `pendiente`.

### `KitServiceSeeder`
2 kits de service para CR-V 2018:
```php
[
    'empresa_id' => 1,
    'codigo_combo' => 'AC-CV265-005',
    'modelo_id' => /* CR-V */,
    'anio_inicio' => 2018,
    'anio_final' => 2022,
    'kilometraje' => 5000,
    'descripcion' => 'MANTENIMIENTO 5.000 KM',
    'express' => false,
    'activo' => true,
],
[
    'empresa_id' => 1,
    'codigo_combo' => 'AC-CV265-050',
    'modelo_id' => /* CR-V */,
    'anio_inicio' => 2018,
    'anio_final' => 2022,
    'kilometraje' => 50000,
    'descripcion' => 'MANTENIMIENTO 50.000 KM',
    'express' => false,
    'activo' => true,
]
```

Con items para el kit de 50,000 km:
- Aceite motor 0W-20 SHPAHELIX ULTRA 4L: cantidad 4, precio 105,000, tipo `producto`
- Aditivo limpieza HMJA0200P93G8YD1: cantidad 1, precio 180,000, tipo `producto`
- Solución acuosa HMJA08798TABS: cantidad 1, precio 10,000, tipo `producto`
- Arandela HMJA9410914000: cantidad 1, precio 4,000, tipo `producto`
- Agua destilada HMPADESTILADA 1L: cantidad 2, precio 4,000, tipo `producto`
- Servicio Mantenimiento 1 (HMJASERV1): tiempo 100 min, precio 150,000, tipo `servicio`

---

## PASO 4: MODELOS ELOQUENT

Crea todos los modelos Eloquent con:
- `$fillable` completo
- `$casts` para booleanos, decimales y fechas
- Todas las relaciones `hasMany`, `belongsTo`, `hasOne`
- Scopes útiles: `scopeActivo()`, `scopePorEmpresa($empresaId)`
- Accesors/mutators donde sea útil

Ejemplo para `Campania.php`:
```php
class Campania extends Model {
    protected $table = 'campanias';
    protected $fillable = ['empresa_id', 'registro_campania', 'tipo_campania', 
                           'fecha', 'fecha_inicio', 'fecha_fin', 'comentario',
                           'codigo_fabrica', 'nro_boletin', 'cantidad_vehiculos', 'activo'];
    protected $casts = ['fecha' => 'date', 'activo' => 'boolean'];
    
    public function empresa() { return $this->belongsTo(Empresa::class); }
    public function vehiculos() { return $this->hasMany(CampaniaVehiculo::class); }
    public function articulos() { return $this->hasMany(CampaniaArticulo::class); }
    
    public function scopeActivo($q) { return $q->where('activo', true); }
    public function scopePorEmpresa($q, $id) { return $q->where('empresa_id', $id); }
    
    public function getCantidadPendientesAttribute() {
        return $this->vehiculos()->where('estado', 'pendiente')->count();
    }
}
```

---

## PASO 5: AUTENTICACIÓN (Laravel Sanctum)

### `AuthController.php`
Implementar los métodos:

**`register()`:** Validar email único, nombre, contraseña (mín 8 chars, 1 mayúscula, 1 número). Crear User con role `cliente`. Crear Cliente asociado. Retornar usuario + token.

**`login()`:** Validar credenciales con `Auth::attempt()`. Emitir token Sanctum con `createToken('spa-token')`. Retornar usuario con roles y token.

**`logout()`:** Revocar token actual con `$request->user()->currentAccessToken()->delete()`.

**`me()`:** Retornar usuario autenticado con relaciones (empresa, cliente si aplica).

### Formato de respuesta estándar:
```php
// En un trait ApiResponse:
protected function success($data, $message = 'OK', $code = 200) {
    return response()->json(['success' => true, 'data' => $data, 'message' => $message], $code);
}
protected function error($message, $errors = [], $code = 422) {
    return response()->json(['success' => false, 'message' => $message, 'errors' => $errors], $code);
}
```

---

## PASO 6: API CONTROLLERS — PORTAL DE CLIENTES

### `VehiculoController.php`
- **`buscar(Request $request)`:** Busca por `?vin=XXX` o `?placa=XXX`. Retorna datos básicos del vehículo + modelo + marca. Si no autenticado, ocultar datos de cliente.
- **`show($id)`:** Ficha completa del vehículo con relaciones (modelo, marca, transmisión, combustible, cliente).
- **`campanias($id)`:** Retornar campañas activas del vehículo con `campania_vehiculos` join `campanias` donde `vehiculos.nro_chassis` en la campaña. Incluir estado de cada campaña para este vehículo.
- **`kitService($id, Request $request)`:** Recibe `?kilometraje=45000`. Busca el kit de service aplicable: `kits_service` donde `modelo_id = vehiculo.modelo_id` AND `anio_inicio <= vehiculo.anio` AND `anio_final >= vehiculo.anio` AND `kilometraje >= $km_actual` ORDER BY `kilometraje` ASC LIMIT 1. Retornar con items (productos y servicios).
- **`misVehiculos()`:** Listar vehículos del cliente autenticado (vía `clientes.user_id`).
- **`vincular($id)`:** Asociar un vehículo al cliente autenticado (verificar que el VIN exista y no tenga otro dueño).

### `CitaController.php`
- **`store(Request $request)`:** Crear cita. Validar: vehiculo_id, tipo_servicio, fecha_solicitada (debe ser futura), comentarios. Retornar cita creada con número generado.
- **`mis_citas()`:** Listar citas del cliente autenticado.

---

## PASO 7: API CONTROLLERS — ADMIN

### `DashboardController.php`
Retornar en una sola llamada:
```php
[
    'campanias_activas' => Campania::activo()->porEmpresa($empresaId)->count(),
    'vehiculos_recall_pendiente' => CampaniaVehiculo::where('estado','pendiente')->count(),
    'citas_hoy' => CitaServicio::whereDate('fecha_solicitada', today())->count(),
    'citas_semana' => CitaServicio::whereBetween('fecha_solicitada', [now()->startOfWeek(), now()->endOfWeek()])->count(),
    'top_campanias' => Campania::withCount(['vehiculos as pendientes' => fn($q) => $q->where('estado','pendiente')])->take(5)->get(),
]
```

### `CampaniaAdminController.php`
CRUD completo:
- `index()`: Listar con filtros (estado, tipo, fecha). Paginar 20 por página. Include `vehiculos_count`, `pendientes_count`.
- `store()`: Crear campaña con validación completa.
- `show($id)`: Campaña con vehiculos (paginados, con datos de vehículo y cliente), articulos.
- `update()`: Editar datos de campaña.
- `destroy()`: Soft delete (solo si no tiene vehiculos facturados).
- `actualizarVehiculo($campaniaId, $vehiculoId)`: Cambiar estado (pendiente → realizado, etc.) con número OT y fechas.
- `importarChassis($id, Request $request)`: Recibir array de VINs, asignar a la campaña si existen en BD.

### `KitServiceAdminController.php`
CRUD completo de kits + CRUD de items del kit.
- `duplicar($id)`: Copiar un kit con todos sus items (funcionalidad "Copia Combo" del sistema original).

### Los demás admin controllers (Vehiculo, Cliente, Cita):
CRUD estándar con filtros, paginación, y búsqueda.

---

## PASO 8: RUTAS API

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    
    // Auth (público)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    
    // Búsqueda pública
    Route::get('/vehiculos/buscar', [VehiculoController::class, 'buscar']);
    
    // Autenticadas (cliente o admin)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        
        Route::get('/vehiculos/{id}', [VehiculoController::class, 'show']);
        Route::get('/vehiculos/{id}/campanias', [VehiculoController::class, 'campanias']);
        Route::get('/vehiculos/{id}/kit-service', [VehiculoController::class, 'kitService']);
        Route::get('/mis-vehiculos', [VehiculoController::class, 'misVehiculos']);
        Route::post('/mis-vehiculos/{id}/vincular', [VehiculoController::class, 'vincular']);
        
        Route::post('/citas', [CitaController::class, 'store']);
        Route::get('/mis-citas', [CitaController::class, 'misCitas']);
    });
    
    // Admin
    Route::middleware(['auth:sanctum', 'role:admin,superadmin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        Route::apiResource('/campanias', CampaniaAdminController::class);
        Route::put('/campanias/{id}/vehiculos/{vid}', [CampaniaAdminController::class, 'actualizarVehiculo']);
        Route::post('/campanias/{id}/importar-chassis', [CampaniaAdminController::class, 'importarChassis']);
        
        Route::apiResource('/kits-service', KitServiceAdminController::class);
        Route::post('/kits-service/{id}/duplicar', [KitServiceAdminController::class, 'duplicar']);
        Route::apiResource('/kits-service/{id}/items', KitServiceItemController::class);
        
        Route::apiResource('/vehiculos', VehiculoAdminController::class);
        Route::apiResource('/clientes', ClienteAdminController::class);
        Route::apiResource('/citas', CitaAdminController::class)->only(['index','show','update']);
        
        // Superadmin only
        Route::middleware('role:superadmin')->group(function () {
            Route::apiResource('/users', UserController::class);
            Route::apiResource('/empresas', EmpresaController::class);
        });
    });
});
```

Crear el middleware `EnsureRole`:
```php
// app/Http/Middleware/EnsureRole.php
public function handle(Request $request, Closure $next, ...$roles) {
    if (!in_array($request->user()?->role, $roles)) {
        return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
    }
    return $next($request);
}
```

---

## PASO 9: FRONTEND REACT — SETUP

### `package.json`
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "@tanstack/react-query": "^5.51.0",
    "axios": "^1.7.0",
    "react-hook-form": "^7.52.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "lucide-react": "^0.427.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "vite": "^5.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### `tailwind.config.js`
```js
module.exports = {
  content: ['./src/**/*.{jsx,js}'],
  theme: {
    extend: {
      colors: {
        honda: {
          red: '#CC0000',
          'red-dark': '#AA0000',
          black: '#1A1A1A',
          gray: '#767676',
          'light-gray': '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      }
    }
  }
}
```

### `src/services/api.js`
```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
});

// Inyectar token en cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirigir al login en 401
api.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data || err);
  }
);

export default api;
```

---

## PASO 10: FRONTEND — COMPONENTES UI

Crea los siguientes componentes reutilizables en `src/components/ui/`:

### `Button.jsx`
Variantes: `primary` (rojo Honda), `secondary` (blanco con borde), `ghost`, `danger`.
```jsx
// Ejemplo de variante primary:
// className: "bg-honda-red hover:bg-honda-red-dark text-white font-bold uppercase tracking-wider px-6 py-3 transition-colors duration-200"
```

### `Input.jsx`
Input estilizado con label flotante al estilo Honda. Soporte para error messages.

### `Card.jsx`
Tarjeta con sombra sutil: `shadow-sm hover:shadow-md transition-shadow bg-white rounded-sm border border-gray-100`

### `Badge.jsx`
Variantes: `danger` (rojo, para recalls pendientes), `success` (verde, para realizados), `warning` (amarillo), `info` (azul).

### `Modal.jsx`
Modal con overlay, animación de entrada, botón de cerrar.

### `Table.jsx`
Tabla responsiva con cabeceras, paginación, y estado vacío.

### `Spinner.jsx`
Indicador de carga circular Honda red.

---

## PASO 11: FRONTEND — LAYOUT

> **REFERENCIA VISUAL OBLIGATORIA:** Replica **exactamente** el diseño del prototipo HTML ubicado en `ahmpostventa/index.html`. Ese archivo es la fuente de verdad visual para todos los componentes públicos. Respeta colores, tipografía, espaciados, clases CSS personalizadas y estructura de cada sección tal como aparecen en el prototipo.
>
> Variables de color definidas en el prototipo:
> - `--honda-red: #CC0000` / hover `#AA0000`
> - `--honda-black: #1A1A1A`
> - `--honda-gray: #767676`
> - `--honda-light: #F5F5F5`
>
> Clases de utilidad clave del prototipo: `.btn-honda`, `.btn-honda-outline`, `.card-shadow`, `.recall-card`, `.tab-btn`, `.vehicle-placeholder`, `.timeline-dot`, `.timeline-line`.

### `src/components/layout/PublicHeader.jsx`
Replica el header del prototipo (`<header class="sticky top-0 z-50 shadow-sm">`):
- **Top bar** (`bg-honda-black`, texto blanco, text-xs centrado): "Llame al 021-XXX-XXXX | Lunes a Viernes 8:00 – 17:00"
- **Main nav** (`bg-white border-b border-gray-200`, `h-14`):
  - Logo: `honda_logo.png` (`h-7`) + `owners_logo.svg` (`h-5`) lado a lado con `gap-4`, clic navega a `/`
  - Botones derecha: ícono lupa (`fa-magnifying-glass`), selector `ES ▼` (text-sm)
  - Botón **"Iniciar sesión"** (`btn-honda text-xs px-4 py-2`, con ícono `fa-user`) cuando no autenticado
  - **Avatar usuario** (círculo rojo `w-8 h-8` con iniciales + nombre + chevron) cuando autenticado
  - Botón hamburger (`fa-bars`) visible solo en mobile
- **Menú mobile** (`#mobile-menu`, oculto por defecto, se abre con toggle): espacio para links de navegación
- La navegación desktop está comentada en el prototipo — no implementarla en esta fase

### `src/components/layout/AdminSidebar.jsx`
Sidebar oscuro (`bg-honda-black`) con:
- Logo VICAR en la parte superior
- Links: Dashboard, Campañas, Kits de Service, Vehículos, Clientes, Citas
- Cada link con ícono Lucide + texto
- Indicador activo con borde izquierdo rojo Honda

### `src/components/layout/PublicFooter.jsx`
Footer negro (`bg-honda-black text-white`) con links organizados en columnas y copyright VICAR.

---

## PASO 12: FRONTEND — PÁGINAS

> **IMPORTANTE:** Cada página debe ser una traducción fiel a React/JSX de la vista correspondiente en `ahmpostventa/index.html`. El prototipo usa `view-section` con JS puro para simular navegación; en React cada sección se convierte en su propio componente/página con React Router.

### `HomePage.jsx`
Replica la vista `#view-search` del prototipo:
- **Hero split** (`flex flex-col md:flex-row`, `min-height: 380px`):
  - Panel izquierdo (`bg-honda-black`, `padding: 56px 64px`): h1 "Bienvenido a Mi Garaje" (blanco, 2.4rem, font-weight 400) + párrafo descriptivo + lista `disc` en gris + botones `INICIAR SESIÓN` (btn-honda) y `REGISTRARSE` (texto blanco, sin fondo) en fila con `gap-24px`
  - Panel derecho: imagen `Hondaimagemobile.png` (`object-fit: cover`, `object-position: center`)
- **Sección buscador** (`bg-white py-12 border-b`):
  - Grid `md:grid-cols-2 gap-12`:
    - Izquierda: label "Accede a tu información" (text-xs uppercase tracking-widest text-gray-400) + h2 "Encuentra tu Honda" (text-4xl font-bold) + descripción + selectores `Año / Modelo / Trim` (border-gray-300, `rounded-sm`) + botón BUSCAR (`btn-honda`) + divisor "— O —" (`flex items-center gap-4`) + campo VIN (font-mono tracking-wider, maxlength=17) con tooltip `i` + botón BUSCAR
    - Derecha (hidden md:flex): placeholder vehículo (`vehicle-placeholder`, `height:280px`) con ícono `fa-car` + texto del modelo
  - Al buscar por VIN → `GET /api/v1/vehiculos/buscar?vin=XX` → navegar a `/garaje`
- **Grid "¿Qué deseas hacer hoy?"** (`bg-gray-50 py-12`): 4 cards (`card-shadow rounded-sm`, con hover `-translate-y-0.5`): Programar servicio (rojo), Retiros del mercado (amarillo), Manual del usuario (azul), Comprar repuestos (verde) — cada uno con ícono FA, título, descripción y link "Ver más →" en rojo
- **Info strip** (`bg-honda-black text-white py-10`): 3 columnas centradas — Garantía Honda / Piezas Genuinas / Soporte 24/7, cada una con ícono rojo FA, título bold y descripción text-gray-400

### `MiGarajePage.jsx`
Replica la vista `#view-garage` del prototipo:
- **Section header** (`bg-white border-b`): label "Mi cuenta" (text-xs uppercase tracking-widest text-gray-400) + h1 "Bienvenido, {nombre}" con nombre en `text-red-700` + subtítulo text-gray-500
- **Layout** `lg:grid-cols-4 gap-6`:
  - **Sidebar** (`lg:col-span-1`, `bg-white card-shadow rounded-sm p-5`):
    - Título "Mis Productos" (text-xs uppercase tracking-widest)
    - Mini vehicle card: `flex items-center gap-3 p-3 bg-gray-50 rounded-sm border-2 border-red-600` (vehículo activo seleccionado) con placeholder `w-14 h-10 vehicle-placeholder` + nombre + VIN parcial
    - Botón "Agregar vehículo": `border-2 border-dashed border-gray-300 w-full py-3 text-xs text-gray-400` con hover en rojo, ícono `fa-plus`
    - Sección "Accesos rápidos": links con ícono FA — Agendar servicio, Recalls activos (badge rojo con conteo), Manual del usuario, Mi perfil
  - **Contenido principal** (`lg:col-span-3`):
    - **Vehicle card** (`bg-white card-shadow rounded-sm`, `grid md:grid-cols-5`):
      - Col-span-2: `vehicle-placeholder h-52` con ícono `fa-car` + nombre + color
      - Col-span-3: `p-6` — título (text-xl font-bold) + trim + VIN mono; alerta de recalls (`bg-red-50 border border-red-200 rounded-sm`, ícono `fa-triangle-exclamation`, texto "X recalls activos", link "Ver ahora →"); grid 3 cols: Km registrados / Año modelo / Recalls (en amarillo si >0); botones `AGENDAR SERVICIO` (btn-honda) + `VER DETALLES` (btn-honda-outline)
    - **Tabs card** (`bg-white card-shadow rounded-sm`): 4 tabs con borde inferior rojo al activo (`.tab-btn.active`):
      - **Recalls de Seguridad** (ícono `fa-triangle-exclamation text-yellow-500` + badge rojo con conteo): banner amarillo (`bg-yellow-50 border-yellow-200`) + lista de `recall-card` con `border-l-4` rojo/verde + badges `PENDIENTE`/`REALIZADO`
      - **Mantenimiento**: placeholder centrado con botón "VER MANTENIMIENTO PROGRAMADO" (btn-honda)
      - **Manual de Usuario**: grid 2 cols de 4 items — Manual Propietario PDF, Manual Garantía PDF, Guías en video, Manual Navegación — cada uno con ícono en cuadro colorido
      - **Historial**: lista de items `flex items-start gap-4 p-4 border border-gray-200 rounded-sm` — ícono en cuadro verde + fecha/OT/descripción + monto derecho

### `DetalleVehiculoPage.jsx`
- Header con imagen placeholder del vehículo (`vehicle-placeholder`) + datos técnicos en grid: modelo, año, VIN (font-mono), transmisión, combustible, Km
- Alerta de recalls pendientes (`bg-red-50 border border-red-200`) si los hay
- Tabs: Recalls | Mantenimiento | Manual | Historial (mismo patrón visual del prototipo)
- Botón "AGENDAR SERVICIO" (`btn-honda`) en sticky bar inferior

### `RecallsPage.jsx`
Replica la vista `#view-recalls` del prototipo:
- **Breadcrumb** (`bg-white border-b`, text-xs text-gray-500): Inicio › Mi Garaje › Recalls de Seguridad con `fa-chevron-right` separadores
- **Banner de alerta** (`bg-yellow-50 border border-yellow-300 rounded-sm px-5 py-4`, ícono `fa-triangle-exclamation text-yellow-600 text-xl`): "Hay X recalls activos para tu {año} {modelo}."
- **Header**: label "Seguridad del vehículo" (uppercase tracking-widest text-gray-400) + h1 "Recalls de Seguridad — Honda CR-V {año}" + fecha actualización
- **VIN confirmation bar** (`bg-white border border-green-300 rounded-sm px-4 py-3 text-sm`): ícono `fa-circle-check text-green-600` + VIN en font-mono font-bold + "✓ Aplica a tu vehículo"
- **Lista de recalls**: tarjetas `bg-white card-shadow rounded-sm` con `border-l-4 border-red-600` (pendiente) / `border-green-500` (realizado); header expandible con badge PENDIENTE/REALIZADO; detalle expandido con descripción, código fábrica, boletín y botón "PROGRAMAR CITA" (btn-honda) si pendiente

### `KitServicePage.jsx`
- Input de kilometraje actual con botón Consultar
- Timeline visual horizontal con mantenimientos completados (✅) y pendientes (○)
- Tarjeta del próximo service con desglose de productos, servicios, y total en Gs
- Formato de precios con `Intl.NumberFormat('es-PY', {style:'currency', currency:'PYG'})`

### `AgendarCitaPage.jsx`
- Formulario con React Hook Form + Zod
- Campos: vehículo (pre-select), tipo servicio, fecha/hora, km, comentarios
- Submit → `POST /api/v1/citas` → mostrar confirmación con número de solicitud

### `admin/DashboardPage.jsx`
- Grid de 4 KPI cards: Campañas activas, Recalls pendientes, Citas hoy, Citas semana
- Tabla de últimas campañas con % de cumplimiento
- Gráfico de barras (últimos 6 meses) de citas completadas

### `admin/CampaniaDetailPage.jsx`
- Cabecera de campaña (código, tipo, fechas, comentario, código fábrica, boletín)
- Tabs: Vehículos Pendientes | Facturadas | Artículos/Servicios
- Tab Pendientes: tabla con VIN, matrícula, fecha venta, cliente, acciones (marcar realizado)
- Modal "Marcar como Realizado": ingresar número OT y fecha
- Tab Facturadas: tabla con fechas de realización/facturación y montos
- Tab Artículos: lista de repuestos y mano de obra de la campaña

### `admin/KitDetailPage.jsx`
- Cabecera con datos del kit (modelo, año, km, descripción)
- Tabs: Productos | Servicios | Tareas de Inspección
- Cada tab con tabla editable de items
- Botón "Duplicar Combo" en la cabecera
- Totales calculados automáticamente

---

## PASO 13: AUTENTICACIÓN FRONTEND

### `src/context/AuthContext.jsx`
```jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.get('/auth/me')
        .then(data => setUser(data.data))
        .catch(() => localStorage.removeItem('auth_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('auth_token', data.data.token);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: ['admin','superadmin'].includes(user?.role) }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Guards de ruta:
```jsx
// PrivateRoute: redirigir a /login si no autenticado
// AdminRoute: redirigir a /mi-garaje si no es admin/superadmin
```

---

## PASO 14: RUTAS FRONTEND

```jsx
// src/routes/index.jsx
<Routes>
  {/* Públicas */}
  <Route path="/" element={<PublicLayout />}>
    <Route index element={<HomePage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="registro" element={<RegisterPage />} />
  </Route>
  
  {/* Cliente autenticado */}
  <Route path="/" element={<PrivateRoute><PublicLayout /></PrivateRoute>}>
    <Route path="mi-garaje" element={<MiGarajePage />} />
    <Route path="vehiculo/:id" element={<DetalleVehiculoPage />}>
      <Route path="recalls" element={<RecallsPage />} />
      <Route path="mantenimiento" element={<KitServicePage />} />
      <Route path="historial" element={<HistorialPage />} />
    </Route>
    <Route path="agendar-cita" element={<AgendarCitaPage />} />
  </Route>
  
  {/* Admin */}
  <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
    <Route index element={<DashboardPage />} />
    <Route path="campanias" element={<CampaniasListPage />} />
    <Route path="campanias/:id" element={<CampaniaDetailPage />} />
    <Route path="kits-service" element={<KitsListPage />} />
    <Route path="kits-service/:id" element={<KitDetailPage />} />
    <Route path="vehiculos" element={<VehiculosPage />} />
    <Route path="clientes" element={<ClientesPage />} />
    <Route path="citas" element={<CitasPage />} />
  </Route>
</Routes>
```

---

## PASO 15: VARIABLES DE ENTORNO

### `backend/.env`
```
APP_NAME="AHM Postventa"
APP_ENV=local
APP_KEY=  # php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=ahm_postventa
DB_USERNAME=ahm_user
DB_PASSWORD=ahm_secret

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=cookie

SANCTUM_STATEFUL_DOMAINS=localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173

MAIL_MAILER=log  # Cambiar a smtp/mailgun en producción
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME="VICAR | Honda Paraguay"
```

---

## CRITERIOS DE ÉXITO DEL MVP

El MVP estará completo cuando las siguientes user stories funcionen end-to-end:

1. **[CLIENTE]** Ingresar un VIN en la página de inicio y ver los datos del vehículo y sus recalls.
2. **[CLIENTE]** Registrar una cuenta, vincular un vehículo, y ver "Mi Garaje" con los recalls pendientes.
3. **[CLIENTE]** Ingresar el kilometraje y ver el próximo kit de service con todos los productos y el precio total.
4. **[CLIENTE]** Completar el formulario de agendar cita y recibir confirmación.
5. **[ADMIN]** Iniciar sesión en el panel admin y ver el dashboard con KPIs reales.
6. **[ADMIN]** Ver la lista de campañas activas, abrir el detalle, y marcar un vehículo como realizado ingresando el número de OT.
7. **[ADMIN]** Abrir un kit de service y ver sus productos, servicios, y totales.
8. **[ADMIN]** Ver la lista de citas solicitadas y confirmar una.

---

## INSTRUCCIONES FINALES

- Escribe código **limpio y bien comentado** en español e inglés mixto (comentarios en español, código en inglés).
- Usa `php artisan make:model`, `make:migration`, `make:controller --resource` para generar boilerplate.
- Ejecuta `php artisan migrate:fresh --seed` al final de la configuración del backend.
- Ejecuta `npm install && npm run dev` para el frontend.
- Asegúrate de que `php artisan route:list` muestre todas las rutas definidas en el Paso 8.
- Al terminar, proporciona el comando exacto para levantar todo el stack con Docker:
  ```bash
  docker-compose up -d && \
  docker exec ahm-backend php artisan migrate:fresh --seed && \
  echo "✅ Stack listo en http://localhost:5173"
  ```
