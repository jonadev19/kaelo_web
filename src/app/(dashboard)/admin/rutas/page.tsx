'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Search, Eye, CheckCircle, XCircle, Trash2, DollarSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Route = {
  id: string;
  nombre: string;
  descripcion: string;
  distancia: number;
  dificultad: 'facil' | 'moderado' | 'dificil' | 'experto';
  precio: number;
  estado: 'borrador' | 'pendiente_aprobacion' | 'aprobada' | 'rechazada' | 'inactiva';
  creador: {
    nombre: string;
  };
  created_at: string;
  total_sales: number;
};

export default function RoutesManagement() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Fetch routes with creator info
  const { data: routes, isLoading } = useQuery<Route[]>({
    queryKey: ['admin-routes', searchTerm, statusFilter, difficultyFilter],
    queryFn: async () => {
      if (!token) throw new Error('No token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/routes`, {
        headers: {
          'x-auth-token': token,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch routes');
      let data = await response.json();

      if (searchTerm) {
        data = data.filter((route: Route) =>
          route.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== 'all') {
        data = data.filter((route: Route) => route.estado === statusFilter);
      }

      if (difficultyFilter !== 'all') {
        data = data.filter((route: Route) => route.dificultad === difficultyFilter);
      }

      return data;
    },
    enabled: !!token,
  });

  // Update route status
  const updateRouteStatus = useMutation({
    mutationFn: async ({ routeId, status }: { routeId: string; status: string }) => {
      if (!token) throw new Error('No token');
      const response = await fetch(`/api/admin/routes/${routeId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({ estado: status }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update route status');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-routes'] });
    },
  });

  // Delete route
  const deleteRoute = useMutation({
    mutationFn: async (routeId: string) => {
      if (!token) throw new Error('No token');
      const response = await fetch(`/api/admin/routes/${routeId}`,
        {
          method: 'DELETE',
          headers: {
            'x-auth-token': token,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete route');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-routes'] });
    },
  });

  const getStatusBadge = (status: RouteStatus) => {
    const variants: Record<RouteStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      borrador: 'default',
      pendiente_aprobacion: 'warning',
      aprobada: 'success',
      rechazada: 'danger',
      inactiva: 'default',
    };

    const labels: Record<RouteStatus, string> = {
      borrador: 'Borrador',
      pendiente_aprobacion: 'Pendiente',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada',
      inactiva: 'Inactiva',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getDifficultyBadge = (difficulty: DifficultyLevel) => {
    const variants: Record<DifficultyLevel, 'success' | 'info' | 'warning' | 'danger'> = {
      facil: 'success',
      moderado: 'info',
      dificil: 'warning',
      experto: 'danger',
    };

    const labels: Record<DifficultyLevel, string> = {
      facil: 'Fácil',
      moderado: 'Moderado',
      dificil: 'Difícil',
      experto: 'Experto',
    };

    return <Badge variant={variants[difficulty]}>{labels[difficulty]}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Rutas</h1>
        <p className="text-gray-600 mt-1">Modera y administra las rutas publicadas en la plataforma</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Buscar por nombre de ruta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="pendiente_aprobacion">Pendientes</option>
              <option value="aprobada">Aprobadas</option>
              <option value="rechazada">Rechazadas</option>
              <option value="borrador">Borradores</option>
            </Select>
            <Select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
              <option value="all">Todas las dificultades</option>
              <option value="facil">Fácil</option>
              <option value="moderado">Moderado</option>
              <option value="dificil">Difícil</option>
              <option value="experto">Experto</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Rutas ({routes?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Creador</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Distancia</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ventas</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes?.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{route.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {route.descripcion?.substring(0, 50)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-900">{route.creador.nombre}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getDifficultyBadge(route.dificultad)}</TableCell>
                  <TableCell className="text-gray-600">{route.distancia} km</TableCell>
                  <TableCell className="text-gray-900 font-medium">
                                        ${(typeof route.precio === 'number' ? route.precio : 0).toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(route.estado)}</TableCell>
                  <TableCell className="text-gray-600">{route.total_sales}</TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {new Date(route.created_at).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {route.estado === 'pendiente_aprobacion' && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateRouteStatus.mutate({ routeId: route.id, status: 'aprobada' })}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Aprobar"
                          >
                            <CheckCircle size={16} className="text-green-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('¿Estás seguro de rechazar esta ruta?')) {
                                updateRouteStatus.mutate({ routeId: route.id, status: 'rechazada' });
                              }
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Rechazar"
                          >
                            <XCircle size={16} className="text-red-600" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('¿Estás seguro de eliminar esta ruta?')) {
                            deleteRoute.mutate(route.id);
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!routes || routes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron rutas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
