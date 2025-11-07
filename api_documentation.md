# Documentación de la API - Ruta Bici-Maya

Este documento detalla los endpoints y la configuración de la API del proyecto.

---

## 1. Configuración Inicial

Para levantar el proyecto, se realizaron los siguientes cambios:

1.  **Instalación de Dependencias:** Se añadieron los paquetes necesarios para la autenticación y la conexión a la base de datos MySQL.
    ```bash
    npm install express sequelize mysql2 jsonwebtoken bcryptjs dotenv
    ```
2.  **Estructura de Archivos:** Se crearon los siguientes archivos y directorios:
    -   `src/config/database.js`: Contiene la configuración y conexión de Sequelize a la base de datos.
    -   `src/models/User.js`: Define el modelo de datos para los usuarios.
    -   `src/controllers/authController.js`: Contiene la lógica de negocio para el registro y login.
    -   `src/routes/auth.js`: Define las rutas para la autenticación.
3.  **Actualización de `server.js`:** Se modificó el archivo principal para incluir la conexión a la base de datos, el middleware para parsear JSON y las rutas de autenticación.

---

## 2. Módulo de Autenticación

Estos son los endpoints para la gestión de cuentas de usuario.

### Registrar un nuevo usuario

-   **Método:** `POST`
-   **URL:** `/api/auth/register`
-   **Descripción:** Crea una nueva cuenta de usuario en el sistema.
-   **Acceso:** Público
-   **Body (Request):**

    ```json
    {
      "nombre": "Nombre del Usuario",
      "email": "usuario@ejemplo.com",
      "password": "una_contraseña_segura",
      "rol": "Ciclista" // Puede ser 'Ciclista', 'Comerciante', o 'Creador de Ruta'
    }
    ```

-   **Respuesta Exitosa (200 OK):**

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### Iniciar sesión

-   **Método:** `POST`
-   **URL:** `/api/auth/login`
-   **Descripción:** Autentica a un usuario existente y devuelve un token de sesión.
-   **Acceso:** Público
-   **Body (Request):**

    ```json
    {
      "email": "usuario@ejemplo.com",
      "password": "una_contraseña_segura"
    }
    ```

-   **Respuesta Exitosa (200 OK):**

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

---

## 3. Módulo de Administración

Endpoints para la gestión y monitoreo de la plataforma. Requieren un rol de `Admin`.

### Obtener estadísticas del Dashboard

-   **Método:** `GET`
-   **URL:** `/api/admin/dashboard`
-   **Descripción:** Devuelve un resumen de las métricas clave de la plataforma para ser mostradas en el panel de administración.
-   **Acceso:** Privado (Solo para usuarios con rol `Admin`)
-   **Headers (Request):**

    ```
    x-auth-token: <tu_jwt_de_admin>
    ```

-   **Respuesta Exitosa (200 OK):**

    ```json
    {
      "totalUsers": 150,
      "totalRoutes": 45,
      "activeStores": 23,
      "totalSales": 1250.75
    }
    ```

### Gestión de Usuarios

### Obtener todos los usuarios

-   **Método:** `GET`
-   **URL:** `/api/admin/users`
-   **Descripción:** Retorna una lista de todos los usuarios registrados en la plataforma.
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers (Request):**
    ```
    x-auth-token: <tu_jwt_de_admin>
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    [
      {
        "id": 1,
        "nombre": "Juan Pérez",
        "email": "juan@example.com",
        "rol": "Ciclista",
        "createdAt": "2023-10-27T10:00:00.000Z",
        "updatedAt": "2023-10-27T10:00:00.000Z"
      }
    ]
    ```

### Crear un nuevo usuario

-   **Método:** `POST`
-   **URL:** `/api/admin/users`
-   **Descripción:** Crea un nuevo usuario. Útil para registrar administradores o comerciantes manualmente.
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers (Request):**
    ```
    x-auth-token: <tu_jwt_de_admin>
    ```
-   **Body (Request):**
    ```json
    {
      "nombre": "Nuevo Usuario",
      "email": "nuevo@example.com",
      "password": "password123",
      "rol": "Comerciante"
    }
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "msg": "Usuario creado exitosamente"
    }
    ```

### Actualizar un usuario

-   **Método:** `PUT`
-   **URL:** `/api/admin/users/:id`
-   **Descripción:** Modifica la información de un usuario existente.
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers (Request):**
    ```
    x-auth-token: <tu_jwt_de_admin>
    ```
-   **Body (Request):**
    ```json
    {
      "nombre": "Nombre Actualizado",
      "email": "email_actualizado@example.com",
      "rol": "Creador de Ruta"
    }
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "msg": "Usuario actualizado exitosamente"
    }
    ```

### Eliminar un usuario

-   **Método:** `DELETE`
-   **URL:** `/api/admin/users/:id`
-   **Descripción:** Elimina un usuario de la base de datos.
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers (Request):**
    ```
    x-auth-token: <tu_jwt_de_admin>
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "msg": "Usuario eliminado exitosamente"
    }
    ```

### Gestión de Rutas

### Obtener todas las rutas

-   **Método:** `GET`
-   **URL:** `/api/admin/routes`
-   **Descripción:** Retorna una lista de todas las rutas de la plataforma, incluyendo la información de su creador.
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers (Request):**
    ```
    x-auth-token: <tu_jwt_de_admin>
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    [
      {
        "id": 1,
        "nombre": "Ruta del Sol",
        "descripcion": "Una hermosa ruta por la costa.",
        "distancia": 25.5,
        "dificultad": "Intermedia",
        "precio": 10.00,
        "estado": "pendiente",
        "creador": {
          "nombre": "Carlos Ruiz"
        }
      }
    ]
    ```

### Actualizar estado de una ruta

-   **Método:** `PUT`
-   **URL:** `/api/admin/routes/:id/status`
-   **Descripción:** Permite al administrador aprobar o rechazar una ruta pendiente.
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers (Request):**
    ```
    x-auth-token: <tu_jwt_de_admin>
    ```
-   **Body (Request):**
    ```json
    {
      "estado": "aprobada" // o "rechazada"
    }
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "msg": "Ruta aprobada exitosamente"
    }
    ```

### Eliminar una ruta

-   **Método:** `DELETE`
-   **URL:** `/api/admin/routes/:id`
-   **Descripción:** Elimina una ruta de la plataforma.
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers (Request):**
    ```
    x-auth-token: <tu_jwt_de_admin>
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "msg": "Ruta eliminada exitosamente"
    }
    ```

### Gestión de Comercios

### Obtener todos los comercios

-   **Método:** `GET`
-   **URL:** `/api/admin/stores`
-   **Descripción:** Retorna una lista de todos los comercios registrados.
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers (Request):**
    ```
    x-auth-token: <tu_jwt_de_admin>
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    [
      {
        "id": 1,
        "nombre": "Tienda de Ana",
        "descripcion": "Venta de artesanías locales.",
        "ubicacion": "Calle Principal 123",
        "estado": "pendiente",
        "propietario": {
          "nombre": "Ana Gómez"
        }
      }
    ]
    ```

### Actualizar estado de un comercio

-   **Método:** `PUT`
-   **URL:** `/api/admin/stores/:id/status`
-   **Descripción:** Permite al administrador aprobar o desactivar un comercio.
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers (Request):**
    ```
    x-auth-token: <tu_jwt_de_admin>
    ```
-   **Body (Request):**
    ```json
    {
      "estado": "activo" // o "inactivo"
    }
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "msg": "Comercio activo exitosamente"
    }
    ```

### Gestión de Transacciones

### Obtener todas las transacciones

-   **Método:** `GET`
-   **URL:** `/api/admin/transactions`
-   **Descripción:** Retorna una lista de todas las transacciones de la plataforma.
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers (Request):**
    ```
    x-auth-token: <tu_jwt_de_admin>
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    [
      {
        "id": 1,
        "monto": 10.00,
        "tipo": "compra_ruta",
        "usuario": {
          "nombre": "Juan Pérez",
          "email": "juan@example.com"
        },
        "ruta": {
          "nombre": "Ruta del Sol"
        }
      }
    ]
    ```
