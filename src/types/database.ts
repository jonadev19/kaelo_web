export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'ciclista' | 'comerciante' | 'creador_ruta' | 'administrador'
export type DifficultyLevel = 'facil' | 'moderado' | 'dificil' | 'experto'
export type RouteStatus = 'borrador' | 'pendiente_aprobacion' | 'aprobada' | 'rechazada' | 'inactiva'
export type StoreStatus = 'pendiente_aprobacion' | 'aprobado' | 'suspendido' | 'rechazado'
export type OrderStatus = 'pendiente' | 'pagado' | 'listo_para_recoger' | 'completado' | 'cancelado'
export type TransactionType = 'compra_ruta' | 'pedido_comercio'
export type PaymentStatus = 'pendiente' | 'completado' | 'fallido' | 'reembolsado'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          role: UserRole
          avatar_url: string | null
          phone: string | null
          is_active: boolean
          email_verified: boolean
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          role?: UserRole
          avatar_url?: string | null
          phone?: string | null
          is_active?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          role?: UserRole
          avatar_url?: string | null
          phone?: string | null
          is_active?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      routes: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string | null
          distance_km: number
          difficulty: DifficultyLevel
          price: number
          status: RouteStatus
          route_geometry: unknown | null
          gpx_file_url: string | null
          estimated_time_hours: number | null
          elevation_gain_m: number | null
          total_sales: number
          view_count: number
          average_rating: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description?: string | null
          distance_km: number
          difficulty: DifficultyLevel
          price: number
          status?: RouteStatus
          route_geometry?: unknown | null
          gpx_file_url?: string | null
          estimated_time_hours?: number | null
          elevation_gain_m?: number | null
          total_sales?: number
          view_count?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string | null
          distance_km?: number
          difficulty?: DifficultyLevel
          price?: number
          status?: RouteStatus
          route_geometry?: unknown | null
          gpx_file_url?: string | null
          estimated_time_hours?: number | null
          elevation_gain_m?: number | null
          total_sales?: number
          view_count?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      stores: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          location: unknown
          address: string | null
          phone: string | null
          status: StoreStatus
          logo_url: string | null
          business_hours: Json | null
          total_orders: number
          average_rating: number
          created_at: string
          updated_at: string
          approved_at: string | null
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          location: unknown
          address?: string | null
          phone?: string | null
          status?: StoreStatus
          logo_url?: string | null
          business_hours?: Json | null
          total_orders?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
          approved_at?: string | null
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          location?: unknown
          address?: string | null
          phone?: string | null
          status?: StoreStatus
          logo_url?: string | null
          business_hours?: Json | null
          total_orders?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
          approved_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          store_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string | null
          is_available: boolean
          stock_quantity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category?: string | null
          is_available?: boolean
          stock_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string | null
          is_available?: boolean
          stock_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          store_id: string
          status: OrderStatus
          total_amount: number
          notes: string | null
          created_at: string
          updated_at: string
          ready_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          store_id: string
          status?: OrderStatus
          total_amount: number
          notes?: string | null
          created_at?: string
          updated_at?: string
          ready_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          store_id?: string
          status?: OrderStatus
          total_amount?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
          ready_at?: string | null
          completed_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          transaction_type: TransactionType
          amount: number
          payment_status: PaymentStatus
          route_id: string | null
          order_id: string | null
          payment_method: string | null
          payment_gateway_id: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          transaction_type: TransactionType
          amount: number
          payment_status?: PaymentStatus
          route_id?: string | null
          order_id?: string | null
          payment_method?: string | null
          payment_gateway_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          transaction_type?: TransactionType
          amount?: number
          payment_status?: PaymentStatus
          route_id?: string | null
          order_id?: string | null
          payment_method?: string | null
          payment_gateway_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      admin_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: Json | null
          created_at?: string
        }
      }
      purchased_routes: {
        Row: {
          id: string
          user_id: string
          route_id: string
          purchase_price: number
          purchased_at: string
        }
        Insert: {
          id?: string
          user_id: string
          route_id: string
          purchase_price: number
          purchased_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          route_id?: string
          purchase_price?: number
          purchased_at?: string
        }
      }
    }
    Views: {
      admin_dashboard_stats: {
        Row: {
          total_users: number | null
          total_cyclists: number | null
          total_merchants: number | null
          total_route_creators: number | null
          total_routes: number | null
          pending_routes: number | null
          total_stores: number | null
          pending_stores: number | null
          total_revenue: number | null
          total_transactions: number | null
        }
      }
      route_creator_sales: {
        Row: {
          route_id: string | null
          title: string | null
          creator_id: string | null
          creator_name: string | null
          price: number | null
          total_sales: number | null
          total_revenue: number | null
          average_rating: number | null
          created_at: string | null
          published_at: string | null
        }
      }
      store_sales_report: {
        Row: {
          store_id: string | null
          store_name: string | null
          owner_id: string | null
          owner_name: string | null
          total_orders: number | null
          total_revenue: number | null
          average_rating: number | null
          created_at: string | null
        }
      }
    }
  }
}
