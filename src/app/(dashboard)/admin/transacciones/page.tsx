'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Search, Download } from 'lucide-react';
import type { Database } from '@/types/database';
import type { TransactionType, PaymentStatus } from '@/types/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  users?: {
    full_name: string;
    email: string;
  };
};

export default function TransactionsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['admin-transactions', searchTerm, typeFilter, statusFilter, dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          users:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (typeFilter !== 'all') {
        query = query.eq('transaction_type', typeFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('payment_status', statusFilter);
      }

      if (dateFrom) {
        query = query.gte('created_at', new Date(dateFrom).toISOString());
      }

      if (dateTo) {
        query = query.lte('created_at', new Date(dateTo).toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Transaction[];
    },
  });

  const getTypeBadge = (type: TransactionType) => {
    const variants: Record<TransactionType, 'info' | 'success'> = {
      compra_ruta: 'info',
      pedido_comercio: 'success',
    };

    const labels: Record<TransactionType, string> = {
      compra_ruta: 'Compra de Ruta',
      pedido_comercio: 'Pedido Comercio',
    };

    return <Badge variant={variants[type]}>{labels[type]}</Badge>;
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const variants: Record<PaymentStatus, 'warning' | 'success' | 'danger' | 'default'> = {
      pendiente: 'warning',
      completado: 'success',
      fallido: 'danger',
      reembolsado: 'default',
    };

    const labels: Record<PaymentStatus, string> = {
      pendiente: 'Pendiente',
      completado: 'Completado',
      fallido: 'Fallido',
      reembolsado: 'Reembolsado',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const totalAmount = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  const completedAmount = transactions?.filter(t => t.payment_status === 'completado')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Transacciones</h1>
          <p className="text-gray-600 mt-1">Administra y monitorea todas las transacciones</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          Exportar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Transacciones</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{transactions?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Monto Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">${totalAmount.toLocaleString('es-MX')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Completadas</p>
            <p className="text-3xl font-bold text-green-600 mt-2">${completedAmount.toLocaleString('es-MX')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">Todos los tipos</option>
              <option value="compra_ruta">Compra de Ruta</option>
              <option value="pedido_comercio">Pedido Comercio</option>
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
              <option value="fallido">Fallido</option>
              <option value="reembolsado">Reembolsado</option>
            </Select>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Fecha desde"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Fecha hasta"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transacciones ({transactions?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm text-gray-600">
                    {transaction.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-900">{transaction.users?.full_name}</p>
                      <p className="text-xs text-gray-500">{transaction.users?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(transaction.transaction_type)}</TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    ${Number(transaction.amount).toLocaleString('es-MX')}
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.payment_status)}</TableCell>
                  <TableCell className="text-gray-600">
                    {transaction.payment_method || 'N/A'}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!transactions || transactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron transacciones</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
