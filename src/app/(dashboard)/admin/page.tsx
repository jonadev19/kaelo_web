'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, MapPin, Store, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_dashboard_stats')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch pending approvals
  const { data: pendingRoutes } = useQuery({
    queryKey: ['pending-routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('id, title, creator_id, created_at')
        .eq('status', 'pendiente_aprobacion')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: pendingStores } = useQuery({
    queryKey: ['pending-stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('id, name, owner_id, created_at')
        .eq('status', 'pendiente_aprobacion')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  // Mock data for charts (in production, fetch from database)
  const monthlyRevenueData = [
    { month: 'Ene', revenue: 12000 },
    { month: 'Feb', revenue: 19000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Abr', revenue: 25000 },
    { month: 'May', revenue: 22000 },
    { month: 'Jun', revenue: 30000 },
  ];

  const userGrowthData = [
    { month: 'Ene', users: 120 },
    { month: 'Feb', users: 250 },
    { month: 'Mar', users: 380 },
    { month: 'Abr', users: 520 },
    { month: 'May', users: 690 },
    { month: 'Jun', users: 850 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Vista general de la plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Usuarios Totales"
          value={stats?.total_users || 0}
          icon={Users}
          color="bg-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Rutas Publicadas"
          value={stats?.total_routes || 0}
          icon={MapPin}
          color="bg-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Comercios Activos"
          value={stats?.total_stores || 0}
          icon={Store}
          color="bg-purple-500"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Ingresos Totales"
          value={`$${(stats?.total_revenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="bg-orange-500"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Pending Approvals Alert */}
      {((stats?.pending_routes || 0) > 0 || (stats?.pending_stores || 0) > 0) && (
        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900">Aprobaciones Pendientes</h3>
                <p className="text-gray-600 mt-1">
                  Hay {stats?.pending_routes || 0} rutas y {stats?.pending_stores || 0} comercios esperando aprobación.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crecimiento de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pendingRoutes && pendingRoutes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Rutas Pendientes de Aprobación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRoutes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{route.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(route.created_at).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Revisar
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {pendingStores && pendingStores.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Comercios Pendientes de Aprobación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingStores.map((store) => (
                  <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{store.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(store.created_at).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Revisar
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
