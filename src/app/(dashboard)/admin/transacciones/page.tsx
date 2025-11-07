'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Search, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Transaction = {
  id: string;
  amount: number;
  type: 'ingreso' | 'egreso';
  status: 'completado' | 'pendiente' | 'fallido';
  description: string;
  date: string;
  user: {
    nombre: string;
  };
};

export default function TransactionsManagement() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: transactions, isLoading } = useQuery<Transaction[]> ({
    queryKey: ['transactions', searchTerm, typeFilter, statusFilter],
    queryFn: async () => {
      if (!token) throw new Error('No token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions`, {
        headers: {
          'x-auth-token': token,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      let data = await response.json();

      if (searchTerm) {
        data = data.filter((transaction: Transaction) =>
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (typeFilter !== 'all') {
        data = data.filter((transaction: Transaction) => transaction.type === typeFilter);
      }

      if (statusFilter !== 'all') {
        data = data.filter((transaction: Transaction) => transaction.status === statusFilter);
      }

      return data;
    },
    enabled: !!token,
  });

  const getStatusBadge = (status: Transaction['status']) => {
    const variants: Record<Transaction['status'], 'default' | 'success' | 'warning' | 'danger'> = {
      completado: 'success',
      pendiente: 'warning',
      fallido: 'danger',
    };

    const labels: Record<Transaction['status'], string> = {
      completado: 'Completado',
      pendiente: 'Pendiente',
      fallido: 'Fallido',
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
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Transacciones</h1>
        <p className="text-gray-600 mt-1">Administra y visualiza todas las transacciones de la plataforma</p>
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
                  placeholder="Buscar por descripción o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">Todos los tipos</option>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
              <option value="fallido">Fallido</option>
            </Select>
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
                <TableHead>ID Transacción</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm text-gray-600">
                    {typeof transaction.id === 'string' ? transaction.id.substring(0, 8) : ''}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.user?.nombre || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'ingreso' ? 'success' : 'danger'}>
                      {transaction.type === 'ingreso' ? 'Ingreso' : 'Egreso'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center gap-1">
                      {transaction.type === 'ingreso' ? (
                        <ArrowUpRight size={16} className="text-green-500" />
                      ) : (
                        <ArrowDownLeft size={16} className="text-red-500" />
                      )}
                      ${(typeof transaction.amount === 'number' ? transaction.amount : 0).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-gray-600">{transaction.description}</TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {new Date(transaction.date).toLocaleDateString('es-MX')}
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
