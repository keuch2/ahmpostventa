# ahmpostventa — AHM Postventa (VICAR | Honda Paraguay)

## Descripción
App de postventa para clientes y administradores de Honda Paraguay (VICAR). Permite a los clientes ver su garaje virtual, recalls, kits de servicio y agendar citas.

## Stack
- **Backend:** Laravel 13 (PHP 8.3+), API REST, autenticación con Sanctum
- **Frontend:** React 19 + Vite, Tailwind CSS, React Query, React Router

## URLs de producción
- Frontend: `https://www.vicar.com.py/mygarage`
- Backend API/Admin: `https://www.vicar.com.py/adminmygarage`

## Estructura del proyecto
```
app/
  backend/   → Laravel API (entry: public/index.php)
  frontend/  → React SPA (build output: dist/)
```

## Entorno local
```bash
# Backend (port 8000)
cd app/backend && php artisan serve

# Frontend (port 5173)
cd app/frontend && npm run dev

# Todo junto
cd app/backend && composer run dev
```

API local apunta a: `http://localhost/ahmpostventa/app/backend/api/v1`

## Entorno de producción
- **Servidor:** `ssh -p5519 root@168.181.184.99`
- **DB:** MySQL, host `localhost`, db `vicar_ahm`, user `vicar_ahm`
- **Web server:** Apache con Alias para `/mygarage` y `/adminmygarage`
- **Rama de producción:** `stable`

## Deploy rápido
```bash
./deploy.sh
```
> Antes del primer uso, editar `DEPLOY_PATH` en `deploy.sh` con la ruta real en el servidor.

## Variables de entorno importantes

### Backend (app/backend/.env)
```
APP_URL=https://www.vicar.com.py/adminmygarage
DB_CONNECTION=mysql
DB_DATABASE=vicar_ahm
CORS_ALLOWED_ORIGINS=https://www.vicar.com.py
```

### Frontend (app/frontend/.env.production)
```
VITE_API_URL=https://www.vicar.com.py/adminmygarage/api/v1
```

## Configuración Apache (producción)
```apache
Alias /adminmygarage /[DOCROOT]/ahmpostventa/app/backend/public
<Directory /[DOCROOT]/ahmpostventa/app/backend/public>
    AllowOverride All
    Require all granted
</Directory>

Alias /mygarage /[DOCROOT]/ahmpostventa/app/frontend/dist
<Directory /[DOCROOT]/ahmpostventa/app/frontend/dist>
    AllowOverride All
    Require all granted
</Directory>
```

## Migraciones y seeders
```bash
cd app/backend
php artisan migrate --force
php artisan db:seed   # solo en entorno fresco
```

## Rutas principales de la API
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET  /api/v1/mis-vehiculos` (auth)
- `GET  /api/v1/admin/dashboard` (admin)

## Git
- Rama principal de desarrollo: `main`
- Rama de producción: `stable`
- Repo: `https://github.com/keuch2/ahmpostventa.git`
