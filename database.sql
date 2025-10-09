-- =====================================================
-- EXTENSIONES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Para manejo de coordenadas geográficas

-- =====================================================
-- ENUMERACIONES
-- =====================================================

-- Roles de usuario
CREATE TYPE user_role AS ENUM ('ciclista', 'comerciante', 'creador_ruta', 'administrador');

-- Niveles de dificultad de rutas
CREATE TYPE difficulty_level AS ENUM ('facil', 'moderado', 'dificil', 'experto');

-- Estados de rutas
CREATE TYPE route_status AS ENUM ('borrador', 'pendiente_aprobacion', 'aprobada', 'rechazada', 'inactiva');

-- Estados de comercios
CREATE TYPE store_status AS ENUM ('pendiente_aprobacion', 'aprobado', 'suspendido', 'rechazado');

-- Estados de pedidos
CREATE TYPE order_status AS ENUM ('pendiente', 'pagado', 'listo_para_recoger', 'completado', 'cancelado');

-- Estados de transacciones
CREATE TYPE transaction_type AS ENUM ('compra_ruta', 'pedido_comercio');

-- Estados de pago
CREATE TYPE payment_status AS ENUM ('pendiente', 'completado', 'fallido', 'reembolsado');

-- =====================================================
-- TABLA: users
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'ciclista',
    avatar_url TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- =====================================================
-- TABLA: routes (Rutas ciclistas)
-- =====================================================
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    distance_km DECIMAL(10, 2) NOT NULL,
    difficulty difficulty_level NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status route_status DEFAULT 'borrador',
    
    -- Datos geográficos (usando PostGIS)
    route_geometry GEOGRAPHY(LINESTRING, 4326), -- Trazado completo de la ruta
    
    -- Archivo GPX original (opcional)
    gpx_file_url TEXT,
    
    -- Metadatos
    estimated_time_hours DECIMAL(5, 2),
    elevation_gain_m INTEGER,
    
    -- Estadísticas
    total_sales INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Validaciones
    CONSTRAINT positive_price CHECK (price >= 0),
    CONSTRAINT positive_distance CHECK (distance_km > 0)
);

-- Índices para routes
CREATE INDEX idx_routes_creator ON routes(creator_id);
CREATE INDEX idx_routes_status ON routes(status);
CREATE INDEX idx_routes_difficulty ON routes(difficulty);
CREATE INDEX idx_routes_price ON routes(price);
CREATE INDEX idx_routes_created_at ON routes(created_at);
CREATE INDEX idx_routes_geometry ON routes USING GIST(route_geometry);

-- =====================================================
-- TABLA: route_images (Fotografías de rutas)
-- =====================================================
CREATE TABLE route_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    is_cover BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para route_images
CREATE INDEX idx_route_images_route ON route_images(route_id);
CREATE INDEX idx_route_images_cover ON route_images(route_id, is_cover);

-- =====================================================
-- TABLA: points_of_interest (POIs)
-- =====================================================
CREATE TABLE points_of_interest (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    poi_type VARCHAR(50), -- cenote, mirador, zona_arqueologica, etc.
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para points_of_interest
CREATE INDEX idx_pois_route ON points_of_interest(route_id);
CREATE INDEX idx_pois_location ON points_of_interest USING GIST(location);
CREATE INDEX idx_pois_type ON points_of_interest(poi_type);

-- =====================================================
-- TABLA: purchased_routes (Rutas compradas por ciclistas)
-- =====================================================
CREATE TABLE purchased_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    purchase_price DECIMAL(10, 2) NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, route_id)
);

-- Índices para purchased_routes
CREATE INDEX idx_purchased_routes_user ON purchased_routes(user_id);
CREATE INDEX idx_purchased_routes_route ON purchased_routes(route_id);
CREATE INDEX idx_purchased_routes_date ON purchased_routes(purchased_at);

-- =====================================================
-- TABLA: stores (Comercios locales)
-- =====================================================
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    status store_status DEFAULT 'pendiente_aprobacion',
    logo_url TEXT,
    
    -- Horarios (formato JSON para flexibilidad)
    business_hours JSONB,
    
    -- Estadísticas
    total_orders INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Índices para stores
CREATE INDEX idx_stores_owner ON stores(owner_id);
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_stores_location ON stores USING GIST(location);

-- =====================================================
-- TABLA: products (Productos de comercios)
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100), -- bebidas, snacks, comida, etc.
    is_available BOOLEAN DEFAULT true,
    stock_quantity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT positive_price CHECK (price >= 0)
);

-- Índices para products
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);

-- =====================================================
-- TABLA: orders (Pedidos a comercios)
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    status order_status DEFAULT 'pendiente',
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ready_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT positive_amount CHECK (total_amount >= 0)
);

-- Índices para orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- =====================================================
-- TABLA: order_items (Detalles de pedidos)
-- =====================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL, -- Guardamos el nombre por si se elimina el producto
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT positive_unit_price CHECK (unit_price >= 0)
);

-- Índices para order_items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- =====================================================
-- TABLA: transactions (Registro de todas las transacciones)
-- =====================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status payment_status DEFAULT 'pendiente',
    
    -- Referencias opcionales según el tipo
    route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    -- Información de pago
    payment_method VARCHAR(50),
    payment_gateway_id VARCHAR(255), -- ID de la pasarela de pagos
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT positive_amount CHECK (amount >= 0)
);

-- Índices para transactions
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(payment_status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_route ON transactions(route_id);
CREATE INDEX idx_transactions_order ON transactions(order_id);

-- =====================================================
-- TABLA: route_reviews (Calificaciones de rutas)
-- =====================================================
CREATE TABLE route_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(route_id, user_id)
);

-- Índices para route_reviews
CREATE INDEX idx_route_reviews_route ON route_reviews(route_id);
CREATE INDEX idx_route_reviews_user ON route_reviews(user_id);
CREATE INDEX idx_route_reviews_rating ON route_reviews(rating);

-- =====================================================
-- TABLA: store_reviews (Calificaciones de comercios)
-- =====================================================
CREATE TABLE store_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(store_id, user_id)
);

-- Índices para store_reviews
CREATE INDEX idx_store_reviews_store ON store_reviews(store_id);
CREATE INDEX idx_store_reviews_user ON store_reviews(user_id);
CREATE INDEX idx_store_reviews_rating ON store_reviews(rating);

-- =====================================================
-- TABLA: admin_logs (Registro de acciones administrativas)
-- =====================================================
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL, -- create, update, delete, approve, reject, suspend
    entity_type VARCHAR(50) NOT NULL, -- user, route, store, transaction
    entity_id UUID,
    details JSONB, -- Información adicional sobre la acción
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para admin_logs
CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_entity ON admin_logs(entity_type, entity_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar estadísticas de rutas cuando se compra
CREATE OR REPLACE FUNCTION increment_route_sales()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE routes 
    SET total_sales = total_sales + 1
    WHERE id = NEW.route_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_route_sales 
    AFTER INSERT ON purchased_routes
    FOR EACH ROW EXECUTE FUNCTION increment_route_sales();

-- Función para actualizar estadísticas de comercios cuando se completa un pedido
CREATE OR REPLACE FUNCTION increment_store_orders()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completado' AND OLD.status != 'completado' THEN
        UPDATE stores 
        SET total_orders = total_orders + 1
        WHERE id = NEW.store_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_store_orders 
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION increment_store_orders();

-- Función para actualizar el rating promedio de rutas
CREATE OR REPLACE FUNCTION update_route_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE routes 
    SET average_rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM route_reviews
        WHERE route_id = COALESCE(NEW.route_id, OLD.route_id)
    )
    WHERE id = COALESCE(NEW.route_id, OLD.route_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_route_rating 
    AFTER INSERT OR UPDATE OR DELETE ON route_reviews
    FOR EACH ROW EXECUTE FUNCTION update_route_average_rating();

-- Función para actualizar el rating promedio de comercios
CREATE OR REPLACE FUNCTION update_store_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE stores 
    SET average_rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM store_reviews
        WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
    )
    WHERE id = COALESCE(NEW.store_id, OLD.store_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_store_rating 
    AFTER INSERT OR UPDATE OR DELETE ON store_reviews
    FOR EACH ROW EXECUTE FUNCTION update_store_average_rating();

-- =====================================================
-- POLÍTICAS RLS (Row Level Security) para Supabase
-- =====================================================

-- Habilitar RLS en las tablas principales
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_routes ENABLE ROW LEVEL SECURITY;

-- Políticas para users (los usuarios pueden ver y editar su propio perfil)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para routes (las rutas aprobadas son públicas)
CREATE POLICY "Anyone can view approved routes" ON routes
    FOR SELECT USING (status = 'aprobada');

CREATE POLICY "Creators can manage own routes" ON routes
    FOR ALL USING (auth.uid() = creator_id);

-- Políticas para stores (tiendas aprobadas son públicas)
CREATE POLICY "Anyone can view approved stores" ON stores
    FOR SELECT USING (status = 'aprobado');

CREATE POLICY "Store owners can manage own store" ON stores
    FOR ALL USING (auth.uid() = owner_id);

-- Políticas para products (productos de tiendas aprobadas son públicos)
CREATE POLICY "Anyone can view available products" ON products
    FOR SELECT USING (
        is_available = true AND 
        EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.status = 'aprobado')
    );

CREATE POLICY "Store owners can manage products" ON products
    FOR ALL USING (
        EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid())
    );

-- Políticas para orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Store owners can view store orders" ON orders
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())
    );

-- Políticas para purchased_routes
CREATE POLICY "Users can view own purchased routes" ON purchased_routes
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para estadísticas del dashboard de administrador
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'ciclista') as total_cyclists,
    (SELECT COUNT(*) FROM users WHERE role = 'comerciante') as total_merchants,
    (SELECT COUNT(*) FROM users WHERE role = 'creador_ruta') as total_route_creators,
    (SELECT COUNT(*) FROM routes WHERE status = 'aprobada') as total_routes,
    (SELECT COUNT(*) FROM routes WHERE status = 'pendiente_aprobacion') as pending_routes,
    (SELECT COUNT(*) FROM stores WHERE status = 'aprobado') as total_stores,
    (SELECT COUNT(*) FROM stores WHERE status = 'pendiente_aprobacion') as pending_stores,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE payment_status = 'completado') as total_revenue,
    (SELECT COUNT(*) FROM transactions WHERE payment_status = 'completado') as total_transactions;

-- Vista para reportes de ventas de creadores de rutas
CREATE OR REPLACE VIEW route_creator_sales AS
SELECT 
    r.id as route_id,
    r.title,
    r.creator_id,
    u.full_name as creator_name,
    r.price,
    r.total_sales,
    (r.price * r.total_sales) as total_revenue,
    r.average_rating,
    r.created_at,
    r.published_at
FROM routes r
JOIN users u ON r.creator_id = u.id
WHERE r.status = 'aprobada';

-- Vista para reportes de ventas de comercios
CREATE OR REPLACE VIEW store_sales_report AS
SELECT 
    s.id as store_id,
    s.name as store_name,
    s.owner_id,
    u.full_name as owner_name,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue,
    s.average_rating,
    s.created_at
FROM stores s
JOIN users u ON s.owner_id = u.id
LEFT JOIN orders o ON s.id = o.store_id AND o.status = 'completado'
GROUP BY s.id, s.name, s.owner_id, u.full_name, s.average_rating, s.created_at;

-- =====================================================
-- COMENTARIOS EN TABLAS
-- =====================================================

COMMENT ON TABLE users IS 'Usuarios de la plataforma (ciclistas, comerciantes, creadores de rutas y administradores)';
COMMENT ON TABLE routes IS 'Rutas ciclistas creadas y publicadas en el marketplace';
COMMENT ON TABLE points_of_interest IS 'Puntos de interés (POIs) a lo largo de las rutas';
COMMENT ON TABLE stores IS 'Comercios locales afiliados que ofrecen servicio de "Pide y Recoge"';
COMMENT ON TABLE products IS 'Catálogo de productos de los comercios locales';
COMMENT ON TABLE orders IS 'Pedidos realizados por ciclistas a comercios locales';
COMMENT ON TABLE transactions IS 'Registro de todas las transacciones financieras de la plataforma';
COMMENT ON TABLE purchased_routes IS 'Registro de rutas compradas por los usuarios';
COMMENT ON TABLE route_reviews IS 'Calificaciones y reseñas de rutas por ciclistas';
COMMENT ON TABLE store_reviews IS 'Calificaciones y reseñas de comercios por usuarios';
COMMENT ON TABLE admin_logs IS 'Registro de auditoría de acciones administrativas';