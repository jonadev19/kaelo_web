# Funcionalidades de la Aplicación "Ruta Bici-Maya"

Este documento describe el conjunto completo de características (features) planeadas para la versión 1.0 de la aplicación web "Ruta Bici-Maya".

---

## 1. Módulo de Gestión de Usuarios

Este módulo maneja todo lo relacionado con las cuentas de los usuarios.

- **Registro de Cuentas:**
  - Un formulario permite a los nuevos usuarios crear una cuenta utilizando su nombre, correo electrónico y una contraseña segura.
  - Los usuarios pueden seleccionar su rol principal (Ciclista, Comerciante, Creador de Ruta) durante el registro.
- **Autenticación:**
  - Pantalla de inicio de sesión para que los usuarios registrados accedan a la plataforma.
  - Sistema de gestión de sesión mediante tokens seguros (JWT).
- **Gestión de Perfil:**
  - Los usuarios pueden ver y editar la información básica de su perfil.
  - Funcionalidad para cambiar la contraseña.

---

## 2. Módulo de Marketplace y Gestión de Rutas

El corazón de la aplicación, donde las rutas se crean, se descubren y se venden.

- **Para Creadores de Rutas:**

  - **Panel de Creador:** Un dashboard personal para gestionar las rutas publicadas.
  - **Herramienta de Creación de Rutas:** Una interfaz visual con un mapa interactivo que permite:
    - Dibujar un trazado punto por punto.
    - Subir un archivo de ruta existente (ej. GPX).
  - **Formulario de Detalles de Ruta:** Campos para definir el título, descripción, distancia, nivel de dificultad, precio y subir fotografías.
  - **Gestión de Puntos de Interés (POIs):** Posibilidad de añadir marcadores en el mapa con descripciones para lugares de interés (cenotes, miradores, etc.).
  - **Publicación:** Opción para publicar la ruta en el marketplace, haciéndola visible y disponible para la compra.

- **Para Ciclistas:**
  - **Exploración de Marketplace:** Una vista de galería o cuadrícula con todas las rutas disponibles.
  - **Búsqueda y Filtros:** Herramientas para buscar rutas por nombre y filtrar por dificultad, distancia o precio.
  - **Página de Detalle de Ruta:** Una vista completa de la ruta con toda su información, mapa previo, POIs y fotos.
  - **Sistema de Compra:** Un flujo de pago seguro, integrado con una pasarela de pagos, para adquirir rutas.
  - **Biblioteca "Mis Rutas":** Una sección privada donde el ciclista puede acceder a todas las rutas que ha comprado.

---

## 3. Módulo de Navegación en Mapa

Esta es la funcionalidad principal para el ciclista una vez que ha comprado una ruta.

- **Visualización en Mapa:** Muestra la ruta completa sobre un mapa interactivo.
- **Seguimiento GPS:** Utiliza el GPS del dispositivo para mostrar la ubicación actual del usuario como un marcador en tiempo real sobre la ruta.
- **Marcadores Interactivos:** Muestra los POIs y los comercios locales afiliados como íconos clicables en el mapa.

---

## 4. Módulo de Comercio Local ("Pide y Recoge")

Este módulo conecta a los ciclistas con los comercios locales en sus rutas.

- **Para Comerciantes:**

  - **Panel de Comerciante:** Un dashboard para la gestión de la tienda y los pedidos.
  - **Registro de Tienda:** Formulario para registrar el negocio, incluyendo nombre, descripción y ubicación en el mapa.
  - **Gestión de Catálogo (similar a "Gestión de Productos"):**
    - **Registrar Producto:** Añadir nuevos productos con nombre, precio, descripción y foto.
    - **Actualizar Producto:** Modificar la información de los productos existentes.
    - **Eliminar Producto:** Quitar productos del catálogo.
    - **Consultar Productos:** Ver una lista de todos los productos de la tienda.
  - **Gestión de Pedidos:** Una vista para ver los pedidos entrantes en tiempo real y marcarlos como "listos para recoger".

- **Para Ciclistas:**
  - **Descubrimiento de Comercios:** Ver los comercios afiliados en el mapa de la ruta.
  - **Visualización de Menú/Catálogo:** Acceder a la lista de productos de un comercio.
  - **Carrito de Compras y Checkout:** Seleccionar productos y pagar por ellos de forma anticipada a través de la aplicación.

---

## 5. Módulo de Reportes y Calificaciones

Funcionalidades para proporcionar retroalimentación y datos de valor.

- **Reportes:**
  - **Para Creadores:** Generar informes básicos de ventas de sus rutas.
  - **Para Comercios:** Generar informes de ventas diarias de los productos vendidos a través de la app.
- **Calificaciones y Reseñas (Futuro):**
  - Permitir a los ciclistas calificar con estrellas y dejar comentarios en las rutas que han completado.
  - Permitir a los usuarios calificar a los comercios donde han comprado.

---

## 6. Módulo de Administración (Panel de Administrador)

Una interfaz administrativa completa, segura y privada para la gestión total de la plataforma.

- **Dashboard Principal:**

  - Vista general con estadísticas clave: número de usuarios registrados, rutas publicadas, ventas totales, comercios activos.
  - Gráficos para visualizar el crecimiento y la actividad en la plataforma.

- **Gestión de Usuarios:**

  - **Visualización y Búsqueda:** Una tabla con todos los usuarios registrados.
  - **Filtros de Búsqueda:** Capacidad para buscar y filtrar usuarios por nombre, correo electrónico, rol (Ciclista, Comerciante, etc.) y fecha de registro.
  - **Operaciones CRUD:**
    - **Alta:** Formulario para crear cuentas de usuario especiales (ej. otros administradores).
    - **Baja:** Opción para suspender o eliminar usuarios que infrinjan las normas.
    - **Modificación:** Capacidad para editar la información de un usuario, incluyendo su rol o restablecer su contraseña.

- **Gestión de Rutas (Moderación):**

  - **Visualización y Búsqueda:** Una tabla con todas las rutas publicadas en la plataforma.
  - **Filtros de Búsqueda:** Capacidad para buscar y filtrar rutas por nombre, creador, precio o estado (pendiente de aprobación, aprobada).
  - **Operaciones CRUD:**
    - **Alta (Aprobación):** Panel para revisar y aprobar las nuevas rutas enviadas por los Creadores.
    - **Baja:** Opción para eliminar rutas que sean fraudulentas, de baja calidad o inapropiadas.
    - **Modificación:** Capacidad para editar los detalles de cualquier ruta si es necesario.

- **Gestión de Comercios:**

  - **Visualización y Búsqueda:** Una tabla con todos los comercios registrados.
  - **Filtros de Búsqueda:** Capacidad para buscar y filtrar comercios por nombre, propietario, ubicación o estado.
  - **Operaciones CRUD:**
    - **Alta (Aprobación):** Panel para revisar y aprobar las solicitudes de nuevos comercios.
    - **Baja:** Opción para desactivar o eliminar comercios.
    - **Modificación:** Capacidad para actualizar la información de un comercio.

- **Gestión de Transacciones:**
  - **Visualización y Búsqueda:** Un registro de todas las transacciones (compras de rutas, pedidos a comercios).
  - **Filtros de Búsqueda:** Capacidad para filtrar transacciones por fecha, usuario, monto o tipo.
  - **Gestión:** Opción para revisar transacciones y gestionar posibles disputas o reembolsos.
