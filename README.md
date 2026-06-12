# taskflow-backend

API REST para la gestión de tareas, desarrollada con Node.js, Express y MongoDB, con autenticación basada en JWT (JSON Web Tokens).

---

## Pruebas de la API con cURL

Puedes probar los endpoints de autenticación directamente desde tu terminal utilizando los siguientes comandos `curl`.

### 1. Registrar un Nuevo Usuario

Este comando crea un usuario en la base de datos. La contraseña será encriptada automáticamente antes de guardarse.

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
```


### 2. Autenticar un Usuario

Este comando autentica al usuario creado en la base de datos. El token JWT se genera automáticamente y se devuelve en la respuesta.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

Y una autenticación invalida sería algo así:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "invalidPassword"}'
```

### 3. Crear una Tarea (Ruta Protegida)
*Reemplaza `<TU_TOKEN_JWT>` por el string que te devolvió el login o el registro o el login.*

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -d '{"title": "Mi primera tarea", "description": "Tengo que terminar el backend de TaskFlow", assignedTo: "federico", "status": "pendiente"}'
```

### 4. Obtener mis Tareas (Ruta Protegida)
*Reemplaza `<TU_TOKEN_JWT>` por el string que te devolvió el login o el registro o el login.*

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" 
```

### 5. Actualizar una Tarea (Ruta Protegida)
*Reemplaza `TASK_ID` por el id de la tarea que quieres actualizar y `<TU_TOKEN_JWT>` por el string que te devolvió el login o el registro o el login.*

```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -d '{"title": "Mi primera tarea", "description": "Tengo que terminar el backend de TaskFlow", assignedTo: "federico", "status": "completada"}'
```

### 6. Eliminar una Tarea (Ruta Protegida)
*Reemplaza `TASK_ID` por el id de la tarea que quieres eliminar y `<TU_TOKEN_JWT>` por el string que te devolvió el login o el registro o el login.*

```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```