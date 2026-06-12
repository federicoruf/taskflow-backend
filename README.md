# 🚀 TaskFlow - Sistema de Gestión de Tareas Multi-Inquilino

TaskFlow es una aplicación web full-stack para la gestión y asignación de tareas individuales y por equipo. Cuenta con una arquitectura desacoplada basada en servicios en el frontend, un sistema de autenticación seguro por JSON Web Tokens (JWT) y una interfaz responsiva de alta fidelidad conectada a una base de datos no relacional.

---

## 🛠️ Stack Tecnológico

### Backend
- **Entorno de ejecución:** Node.js con Express
- **Base de Datos:** MongoDB con Mongoose Object Modeling (ODM) - Desplegado localmente mediante Docker
- **Seguridad:** Bcrypt (hashing de contraseñas) y JSON Web Tokens (JWT)

### Frontend
- **Framework:** React.js (con Hooks modernos)
- **Diseño e Interfaz:** Material-UI (MUI v5)
- **Gestión de Estado:** Context API (Seguridad global) y reactivos locales (`useState` / `useEffect`)
- **Peticiones HTTP:** Axios (con interceptores automatizados de cabeceras de autorización)
- **Pruebas Unitarias:** Vitest y React Testing Library

---

## 📂 Arquitectura del Proyecto

El ecosistema de TaskFlow está dividido en dos módulos independientes (Monorepo):


### Módulo Backend (`/backend`)
```text
backend/
├── config/          # Configuración centralizada (Conexión a MongoDB)
├── controllers/     # Lógica de negocio (authController, taskController)
├── middleware/      # Filtros de seguridad (authMiddleware para validar JWT)
├── models/          # Esquemas de Mongoose (User, Task Schema)
├── routes/          # Endpoints de la API REST (authRoutes, taskRoutes)
├── .env             # Variables ocultas de producción (MONGO_URI, JWT_SECRET)
└── server.js        # Punto de entrada y arranque del servidor Express
```

### Módulo Frontend (`/frontend`)

```text
src/
├── components/      # Componentes de UI (TaskCard, TaskForm adaptados al Mongoose Schema)
├── context/         # Estado de sesión global atómico (AuthContext)
├── pages/           # Vistas principales del ecosistema (Login, Register, Dashboard)
├── services/        # Capa de servicios centralizada (api, authService, taskService)
├── setupTests.js    # Configuración de Matchers para el entorno de pruebas
└── main.jsx         # Punto de entrada de la aplicación
```

---

## ⚙️ Configuración e Inicialización del Proyecto

Sigue estos pasos en orden para clonar y ejecutar el ecosistema completo en tu entorno local.

### Requisitos Previos
Es necesario tener instalado Docker y Docker Desktop en el equipo, además de Node.js.

### 1. Levantar la Base de Datos (MongoDB en Docker)
Abre una terminal en la raíz principal del proyecto (donde se encuentra el archivo docker-compose.yml) y ejecuta:

```bash
docker-compose up -d
```

### 2. Variables de Entorno (.env)

Crea un archivo `.env` dentro de la carpeta `/frontend` con el siguiente contenido para mapear las peticiones a tu servidor local:

```
VITE_API_URL=http://localhost:5000/api
```

Crea un archivo `.env` dentro de la carpeta `/backend` con las siguientes credenciales:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow   # O tu cadena de conexión a MongoDB Atlas
JWT_SECRET=tu_clave_secreta_super_segura_123   # Frase semilla para encriptar los tokens
```

### 3. Instalar dependencias e Iniciar el Backend (Express + MongoDB)

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
cd backend
npm install
npm run dev
```

### 4. Instalar dependencias e Iniciar el Frontend (React + Vite)

Abre una segunda terminal en la raíz del proyecto y ejecuta:

```bash
cd frontend
npm install
npm run dev
```

La aplicación web se desplegará en: `http://localhost:5173`

---

## Suite de Pruebas Automatizadas (Frontend)

El frontend incluye pruebas de integración y comportamiento que garantizan el correcto funcionamiento del contexto de seguridad y el formulario según los contratos del Schema del servidor.

Para correr las pruebas unitarias y de simulación de entorno de Vitest, ejecuta:

```bash
cd frontend
npm run test
```

---

## Pruebas de la API aislada con cURL (Módulo Backend)

Puedes verificar o auditar el comportamiento de los endpoints de la API REST de forma manual y aislada desde tu terminal utilizando los siguientes comandos `curl`.

### 1. Registrar un Nuevo Usuario

Crea un usuario en la base de datos. La contraseña será encriptada automáticamente mediante Bcrypt antes de guardarse.

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
```

### 2. Autenticar un Usuario (Login Exitoso)

Este comando autentica al usuario. El token JWT se genera automáticamente en el backend y se devuelve en la respuesta para ser usado por el cliente.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 3. Intento Inválido de Autenticación (Manejo de Errores)

Prueba de control para validar el rechazo seguro de credenciales erróneas.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "invalidPassword"}'
```

### 4. Crear una Tarea (Ruta Protegida)

Reemplaza `<TU_TOKEN_JWT>` por el string recibido en la respuesta del login o registro.

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -d '{"title": "Mi primera tarea", "description": "Tengo que terminar el backend de TaskFlow", "assignedTo": "federico", "status": "pendiente"}'
```

### 5. Obtener mis Tareas (Ruta Protegida)

Trae únicamente las tareas asociadas al ID del usuario autenticado en el token.

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

### 6. Actualizar una Tarea (Ruta Protegida)

Reemplaza `TASK_ID` por el identificador único (`_id`) generado por MongoDB.

```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -d '{"title": "Mi primera tarea", "description": "Tengo que terminar el backend de TaskFlow", "assignedTo": "federico", "status": "completada"}'
```

### 7. Eliminar una Tarea (Ruta Protegida)

Remueve permanentemente el registro de la tarea de la base de datos.

```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

## Documentación Interactiva de la API (Swagger UI)

* **URL de acceso local:** `http://localhost:5000/api-docs`
