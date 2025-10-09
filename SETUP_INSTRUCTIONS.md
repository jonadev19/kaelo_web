# 🚀 Instrucciones de Configuración - Módulo de Administración

## ✅ Completado

El **Módulo 6: Panel de Administración** ha sido implementado exitosamente con las siguientes características:

### Módulos Implementados

1. ✅ **Dashboard Principal** (`/admin`)
   - Estadísticas en tiempo real
   - Gráficos de ingresos y crecimiento
   - Alertas de aprobaciones pendientes

2. ✅ **Gestión de Usuarios** (`/admin/usuarios`)
   - CRUD completo
   - Búsqueda y filtros
   - Suspender/activar cuentas

3. ✅ **Gestión de Rutas** (`/admin/rutas`)
   - Moderación de rutas
   - Aprobar/rechazar
   - Filtros por estado y dificultad

4. ✅ **Gestión de Comercios** (`/admin/comercios`)
   - Aprobar/rechazar comercios
   - Suspender comercios
   - Visualización de métricas

5. ✅ **Gestión de Transacciones** (`/admin/transacciones`)
   - Visualización completa
   - Filtros avanzados
   - Estadísticas financieras

## 📋 Pasos para Configurar

### 1. Configurar Variables de Entorno

Necesitas agregar tus credenciales de Supabase al archivo `.env.local`:

```bash
# Edita el archivo .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

**Dónde encontrar estas credenciales:**
1. Ve a tu proyecto en [Supabase](https://app.supabase.com)
2. Navega a Settings → API
3. Copia la `Project URL` y la `anon public` key

### 2. Verificar la Base de Datos

Asegúrate de que la base de datos `kaelo_web` en Supabase tenga:

✅ Todas las tablas creadas (según `database.sql`)
✅ Las vistas creadas:
   - `admin_dashboard_stats`
   - `route_creator_sales`
   - `store_sales_report`
✅ Los triggers y funciones configurados
✅ Row Level Security (RLS) habilitado

**Para verificar:**
```sql
-- En el SQL Editor de Supabase
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 3. Ejecutar el Proyecto

```bash
# Instalar dependencias (ya instaladas)
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El panel de administración estará disponible en:
```
http://localhost:3000/admin
```

### 4. Acceder al Panel

**IMPORTANTE**: Por ahora, el panel NO tiene autenticación implementada. Necesitarás:

1. **Implementar autenticación** (próximo paso recomendado)
2. **Crear un usuario administrador** en la base de datos:

```sql
-- En Supabase SQL Editor
INSERT INTO users (email, password_hash, full_name, role, is_active)
VALUES (
  'admin@rutabicimaya.com',
  -- Usar un hash real de bcrypt
  '$2a$10$...',
  'Administrador',
  'administrador',
  true
);
```

## 🔒 Seguridad - IMPORTANTE

### Antes de pasar a producción:

1. **Implementar autenticación**:
   ```typescript
   // Ejemplo de verificación en el layout
   const { data: session } = await supabase.auth.getSession();
   if (!session || session.user.role !== 'administrador') {
     redirect('/login');
   }
   ```

2. **Configurar RLS para administradores**:
   ```sql
   -- Política para que solo admins accedan a todas las tablas
   CREATE POLICY "Admin access" ON users
   FOR ALL USING (
     auth.uid() IN (
       SELECT id FROM users WHERE role = 'administrador'
     )
   );
   ```

3. **Proteger las rutas** del panel de administración

## 📁 Estructura Creada

```
src/
├── app/(dashboard)/admin/
│   ├── layout.tsx                    # ✅ Layout del dashboard
│   ├── page.tsx                      # ✅ Dashboard principal
│   ├── usuarios/page.tsx             # ✅ Gestión de usuarios
│   ├── rutas/page.tsx                # ✅ Gestión de rutas
│   ├── comercios/page.tsx            # ✅ Gestión de comercios
│   └── transacciones/page.tsx        # ✅ Gestión de transacciones
│
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx          # ✅ Navegación lateral
│   │   ├── AdminHeader.tsx           # ✅ Header
│   │   └── StatCard.tsx              # ✅ Tarjetas de stats
│   └── ui/
│       ├── Button.tsx                # ✅ Componente de botón
│       ├── Card.tsx                  # ✅ Componente de tarjeta
│       ├── Input.tsx                 # ✅ Input con validación
│       ├── Select.tsx                # ✅ Select con validación
│       ├── Table.tsx                 # ✅ Componentes de tabla
│       └── Badge.tsx                 # ✅ Badges con colores
│
├── hooks/
│   ├── useAdminStats.ts              # ✅ Stats del dashboard
│   ├── useUsers.ts                   # ✅ CRUD de usuarios
│   ├── useRoutes.ts                  # ✅ CRUD de rutas
│   └── useStores.ts                  # ✅ CRUD de comercios
│
├── lib/
│   ├── supabase.ts                   # ✅ Cliente de Supabase
│   └── utils/
│       ├── formatters.ts             # ✅ Formateo de datos
│       └── constants.ts              # ✅ Constantes
│
├── types/
│   └── database.ts                   # ✅ Tipos TypeScript
│
└── context/
    └── QueryProvider.tsx             # ✅ Provider React Query
```

## 🧪 Probar el Módulo

### 1. Dashboard Principal
```
http://localhost:3000/admin
```
Deberías ver:
- 4 tarjetas de estadísticas
- 2 gráficos (ingresos y usuarios)
- Alertas de aprobaciones pendientes

### 2. Gestión de Usuarios
```
http://localhost:3000/admin/usuarios
```
Funcionalidades:
- Ver todos los usuarios
- Buscar por nombre/email
- Filtrar por rol
- Suspender/activar usuarios

### 3. Gestión de Rutas
```
http://localhost:3000/admin/rutas
```
Funcionalidades:
- Ver todas las rutas
- Filtrar por estado y dificultad
- Aprobar rutas pendientes
- Rechazar rutas

### 4. Gestión de Comercios
```
http://localhost:3000/admin/comercios
```
Funcionalidades:
- Ver todos los comercios
- Aprobar comercios nuevos
- Suspender comercios activos

### 5. Gestión de Transacciones
```
http://localhost:3000/admin/transacciones
```
Funcionalidades:
- Ver todas las transacciones
- Filtrar por tipo, estado y fechas
- Ver estadísticas financieras

## 📦 Dependencias Instaladas

```json
{
  "@supabase/supabase-js": "^2.75.0",
  "@tanstack/react-query": "^5.90.2",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.545.0",
  "recharts": "^3.2.1"
}
```

## 🐛 Solución de Problemas

### Error: "No se puede conectar a Supabase"
- Verifica que las variables de entorno estén correctamente configuradas
- Verifica que el proyecto de Supabase esté activo

### Error: "No hay datos en el dashboard"
- Verifica que la vista `admin_dashboard_stats` esté creada
- Ejecuta el archivo `database.sql` completo en Supabase

### Error: "No se pueden aprobar rutas"
- Verifica que los triggers estén creados correctamente
- Verifica las políticas RLS

### Los estilos no se ven correctamente
- Verifica que Tailwind CSS esté configurado
- Ejecuta `npm run dev` de nuevo

## 📚 Documentación Adicional

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de React Query](https://tanstack.com/query/latest)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Recharts](https://recharts.org/)

## 🎯 Próximos Pasos Recomendados

1. **Implementar autenticación completa**
   - Sistema de login
   - Verificación de rol de administrador
   - Protección de rutas

2. **Mejorar el dashboard**
   - Más gráficos y visualizaciones
   - Filtros de fecha en estadísticas
   - Comparativas mensuales

3. **Sistema de notificaciones**
   - Notificaciones en tiempo real
   - Alertas por email

4. **Exportación de datos**
   - Exportar a CSV/Excel
   - Generar reportes PDF

5. **Logs de auditoría**
   - Registrar todas las acciones administrativas
   - Tabla `admin_logs` ya existe

6. **Mejoras UX**
   - Confirmaciones más detalladas
   - Mensajes de éxito/error
   - Animaciones de transición

## 💡 Tips

- Usa React Query DevTools para debugging
- Revisa la consola del navegador para errores
- Verifica los logs de Supabase en la plataforma
- Los datos se cachean por 60 segundos (configuración en QueryProvider)

---

**¡El módulo está listo para usar!** 🎉

Si necesitas ayuda adicional, revisa el archivo `ADMIN_MODULE_README.md` para más detalles técnicos.
