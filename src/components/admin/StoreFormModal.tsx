'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Database } from '@/types/database';

type Store = Database['public']['Tables']['stores']['Row'];

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  store?: Store | null;
  isLoading?: boolean;
}

export function StoreFormModal({ isOpen, onClose, onSubmit, store, isLoading }: StoreFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    status: 'pendiente_aprobacion' as any,
  });

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        description: store.description || '',
        address: store.address || '',
        phone: store.phone || '',
        status: store.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        address: '',
        phone: '',
        status: 'pendiente_aprobacion',
      });
    }
  }, [store]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={store ? 'Editar Comercio' : 'Crear Comercio'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Comercio"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <Input
          label="Dirección"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <Input
          label="Teléfono"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Select
          label="Estado"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          required
        >
          <option value="pendiente_aprobacion">Pendiente Aprobación</option>
          <option value="aprobado">Aprobado</option>
          <option value="suspendido">Suspendido</option>
          <option value="rechazado">Rechazado</option>
        </Select>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : store ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
