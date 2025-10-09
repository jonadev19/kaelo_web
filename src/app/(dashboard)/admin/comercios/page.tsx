'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Search, Eye, CheckCircle, XCircle, Trash2, Ban } from 'lucide-react';
import type { Database } from '@/types/database';
import type { StoreStatus } from '@/types/database';

type Store = Database['public']['Tables']['stores']['Row'] & {
  users?: {
    full_name: string;
    email: string;
  };
};

export default function StoresManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch stores with owner info
  const { data: stores, isLoading } = useQuery({
    queryKey: ['admin-stores', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('stores')
        .select(`
          *,
          users:owner_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Store[];
    },
  });

  // Approve store
  const approveStore = useMutation({
    mutationFn: async (storeId: string) => {
      const { error } = await supabase
        .from('stores')
        .update({ 
          status: 'aprobado',
          approved_at: new Date().toISOString(),
        })
        .eq('id', storeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
    },
  });

  // Reject store
  const rejectStore = useMutation({
    mutationFn: async (storeId: string) => {
      const { error } = await supabase
        .from('stores')
        .update({ status: 'rechazado' })
        .eq('id', storeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
    },
  });

  // Suspend store
  const suspendStore = useMutation({
    mutationFn: async (storeId: string) => {
      const { error } = await supabase
        .from('stores')
        .update({ status: 'suspendido' })
        .eq('id', storeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
    },
  });

  // Delete store
  const deleteStore = useMutation({
    mutationFn: async (storeId: string) => {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
    },
  });

  const getStatusBadge = (status: StoreStatus) => {
    const variants: Record<StoreStatus, 'default' | 'success' | 'warning' | 'danger'> = {
      pendiente_aprobacion: 'warning',
      aprobado: 'success',
      suspendido: 'danger',
      rechazado: 'danger',
    };

    const labels: Record<StoreStatus, string> = {
      pendiente_aprobacion: 'Pendiente',
      aprobado: 'Aprobado',
      suspendido: 'Suspendido',
      rechazado: 'Rechazado',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
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
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Comercios</h1>
        <p className="text-gray-600 mt-1">Administra los comercios locales de la plataforma</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Buscar por nombre de comercio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="pendiente_aprobacion">Pendientes</option>
              <option value="aprobado">Aprobados</option>
              <option value="suspendido">Suspendidos</option>
              <option value="rechazado">Rechazados</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Comercios ({stores?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores?.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{store.name}</p>
                      <p className="text-sm text-gray-500">{store.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-900">{store.users?.full_name}</p>
                      <p className="text-xs text-gray-500">{store.users?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm max-w-xs truncate">
                    {store.address || 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(store.status)}</TableCell>
                  <TableCell className="text-gray-600">{store.total_orders}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-900">{store.average_rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {new Date(store.created_at).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {store.status === 'pendiente_aprobacion' && (
                        <>
                          <button
                            type="button"
                            onClick={() => approveStore.mutate(store.id)}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Aprobar"
                          >
                            <CheckCircle size={16} className="text-green-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('¿Estás seguro de rechazar este comercio?')) {
                                rejectStore.mutate(store.id);
                              }
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Rechazar"
                          >
                            <XCircle size={16} className="text-red-600" />
                          </button>
                        </>
                      )}
                      {store.status === 'aprobado' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('¿Estás seguro de suspender este comercio?')) {
                              suspendStore.mutate(store.id);
                            }
                          }}
                          className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Suspender"
                        >
                          <Ban size={16} className="text-orange-600" />
                        </button>
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
                          if (confirm('¿Estás seguro de eliminar este comercio?')) {
                            deleteStore.mutate(store.id);
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

          {!stores || stores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron comercios</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
