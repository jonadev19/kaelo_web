# Módulo de Administración - Ruta Bici-Maya

Este documento describe el **Módulo 6: Panel de Administración** de la aplicación Ruta Bici-Maya.

## 📋 Características Implementadas

### 1. Dashboard Principal
- **Estadísticas en tiempo real**:
  - Usuarios totales (ciclistas, comerciantes, creadores)
  - Rutas publicadas y pendientes
  - Comercios activos y pendientes
  - Ingresos totales y transacciones
- **Gráficos visuales**:
  - Ingresos mensuales (BarChart)
  - Crecimiento de usuarios (LineChart)
- **Alertas de aprobaciones pendientes**
- **Actividad reciente** de rutas y comercios

### 2. Gestión de Usuarios (CRUD)
- **Visualización** de todos los usuarios
- **Búsqueda** por nombre o email
- **Filtros** por rol (ciclista, comerciante, creador, administrador)
- **Acciones**:
  - Editar información del usuario
  - Suspender/Activar cuenta
  - Eliminar usuario
- **Badges** visuales por rol y estado

### 3. Gestión de Rutas (Moderación)
- **Visualización** de todas las rutas
- **Búsqueda** por título
- **Filtros**:
  - Estado (pendiente, aprobada, rechazada, borrador)
  - Dificultad (fácil, moderado, difícil, experto)
- **Acciones de moderación**:
  - Aprobar ruta (cambia estado a "aprobada")
  - Rechazar ruta
  - Eliminar ruta
- **Información del creador** en cada ruta
- **Métricas**: ventas, rating, precio, distancia

### 4. Gestión de Comercios
- **Visualización** de todos los comercios
- **Búsqueda** por nombre
- **Filtros** por estado
- **Acciones**:
  - Aprobar comercio nuevo
  - Rechazar solicitud
  - Suspender comercio activo
  - Eliminar comercio
- **Información del propietario**
- **Métricas**: pedidos totales, rating promedio

### 5. Gestión de Transacciones
- **Visualización** de todas las transacciones
- **Filtros**:
  - Tipo (compra de ruta, pedido comercio)
  - Estado (pendiente, completado, fallido, reembolsado)
  - Rango de fechas
- **Estadísticas**:
  - Total de transacciones
  - Monto total
  - Monto completado
- **Información detallada** de cada transacción
- **Exportación** (preparado para implementar)

## 🛠️ Tecnologías Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Supabase** - Base de datos y autenticación
- **React Query (@tanstack/react-query)** - Gestión de estado del servidor
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas

## 📁 Estructura de Archivos

```
src/
├── app/
│   └── (dashboard)/
│       └── admin/
│           ├── layout.tsx          # Layout del dashboard
│           ├── page.tsx             # Dashboard principal
│           ├── usuarios/
│           │   └── page.tsx         # Gestión de usuarios
│           ├── rutas/
│           │   └── page.tsx         # Gestión de rutas
│           ├── comercios/
│           │   └── page.tsx         # Gestión de comercios
│           └── transacciones/
│               └── page.tsx         # Gestión de transacciones
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx        # Barra lateral de navegación
│   │   ├── AdminHeader.tsx         # Encabezado del dashboard
│   │   └── StatCard.tsx            # Tarjeta de estadísticas
│   └── ui/
│       ├── Button.tsx              # Componente de botón
│       ├── Card.tsx                # Componente de tarjeta
│       ├── Input.tsx               # Componente de input
│       ├── Select.tsx              # Componente de select
│       ├── Table.tsx               # Componentes de tabla
│       └── Badge.tsx               # Componente de badge
├── hooks/
│   ├── useAdminStats.ts            # Hook para estadísticas
│   ├── useUsers.ts                 # Hooks de usuarios
│   ├── useRoutes.ts                # Hooks de rutas
│   └── useStores.ts                # Hooks de comercios
├── lib/
│   ├── supabase.ts                 # Cliente de Supabase
│   └── utils/
│       ├── formatters.ts           # Funciones de formateo
│       └── constants.ts            # Constantes de la app
├── types/
│   └── database.ts                 # Tipos de la base de datos
└── context/
    └── QueryProvider.tsx           # Provider de React Query
```

## 🚀 Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 2. Base de Datos

La base de datos ya está creada en Supabase con el nombre `kaelo_web`. El esquema SQL se encuentra en `database.sql`.

**Vistas importantes**:
- `admin_dashboard_stats` - Estadísticas del dashboard
- `route_creator_sales` - Ventas de creadores
- `store_sales_report` - Reporte de ventas de comercios

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

El panel de administración estará disponible en: `http://localhost:3000/admin`

## 🔐 Seguridad

### Row Level Security (RLS)

Las políticas RLS están configuradas en la base de datos para:
- Los usuarios solo pueden ver/editar su propio perfil
- Las rutas aprobadas son públicas
- Los comercios aprobados son públicos
- Solo los administradores pueden acceder a todas las tablas

**IMPORTANTE**: Asegúrate de implementar autenticación y verificar el rol de administrador antes de permitir el acceso al panel.

## 📊 Características de la Base de Datos

### Triggers Automáticos
- Actualización automática de `updated_at`
- Incremento de ventas al comprar rutas
- Incremento de pedidos al completar órdenes
- Actualización de ratings promedio

### Funciones Útiles
- `update_route_average_rating()` - Actualiza el rating de rutas
- `update_store_average_rating()` - Actualiza el rating de comercios
- `increment_route_sales()` - Incrementa ventas de rutas
- `increment_store_orders()` - Incrementa pedidos de comercios

## 🎨 Componentes UI Reutilizables

Todos los componentes UI están en `src/components/ui/`:

- **Button**: Botón con variantes (primary, secondary, danger, ghost)
- **Card**: Tarjeta con header, title y content
- **Input**: Input con label y manejo de errores
- **Select**: Select con label y manejo de errores
- **Table**: Componentes de tabla completos
- **Badge**: Badges con variantes de color

## 🔄 React Query

Los hooks personalizados utilizan React Query para:
- **Caché automático** de datos
- **Revalidación** al cambiar de ventana
- **Invalidación** después de mutaciones
- **Loading y error states** automáticos

Ejemplo de uso:

```tsx
const { data: users, isLoading } = useUsers({ 
  search: 'juan',
  role: 'ciclista' 
});

const updateUser = useUpdateUser();
updateUser.mutate({ id: '123', full_name: 'Nuevo Nombre' });
```

## 📝 Próximos Pasos

1. **Autenticación**: Implementar sistema de login para administradores
2. **Autorización**: Verificar rol de administrador en cada ruta
3. **Notificaciones**: Sistema de notificaciones en tiempo real
4. **Exportación**: Implementar exportación de datos a CSV/Excel
5. **Logs de auditoría**: Registrar todas las acciones administrativas
6. **Permisos granulares**: Diferentes niveles de acceso para administradores

## 🐛 Debugging

Para ver las queries de React Query en desarrollo, puedes instalar las DevTools:

```bash
npm install @tanstack/react-query-devtools
```

Y agregar en `QueryProvider.tsx`:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Dentro del return
<ReactQueryDevtools initialIsOpen={false} />
```

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:
1. Revisa la documentación de Supabase
2. Revisa la documentación de React Query
3. Verifica las políticas RLS en Supabase
4. Revisa los logs del navegador

---

**Desarrollado para Ruta Bici-Maya** 🚴‍♂️
