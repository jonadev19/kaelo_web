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
