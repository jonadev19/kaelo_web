'use client';

import { useQuery } from '@tanstack/react-query';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, MapPin, Store, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '@/context/AuthContext';

interface DashboardStatsResponse {
  totalUsers: number;
  totalRoutes: number;
  activeStores: number;
  totalSales: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery<DashboardStatsResponse>({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      if (!token) {
        throw new Error('Authentication token not available.');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`, {
        headers: {
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!token,
  });

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
          value={stats?.totalUsers || 0}
          icon={Users}
          color="bg-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Rutas Publicadas"
          value={stats?.totalRoutes || 0}
          icon={MapPin}
          color="bg-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Comercios Activos"
          value={stats?.activeStores || 0}
          icon={Store}
          color="bg-purple-500"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Ingresos Totales"
          value={`$${(stats?.totalSales || 0).toLocaleString()}`}
          icon={DollarSign}
          color="bg-orange-500"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts */}
    </div>
  );
}
