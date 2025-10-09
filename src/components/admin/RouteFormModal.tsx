'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Database } from '@/types/database';

type Route = Database['public']['Tables']['routes']['Row'];

interface RouteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  route?: Route | null;
  isLoading?: boolean;
}

export function RouteFormModal({ isOpen, onClose, onSubmit, route, isLoading }: RouteFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    distance_km: '',
    difficulty: 'facil' as any,
    price: '',
    status: 'borrador' as any,
  });

  useEffect(() => {
    if (route) {
      setFormData({
        title: route.title,
        description: route.description || '',
        distance_km: route.distance_km.toString(),
        difficulty: route.difficulty,
        price: route.price.toString(),
        status: route.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        distance_km: '',
        difficulty: 'facil',
        price: '',
        status: 'borrador',
      });
    }
  }, [route]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      distance_km: parseFloat(formData.distance_km),
      price: parseFloat(formData.price),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={route ? 'Editar Ruta' : 'Crear Ruta'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Distancia (km)"
            type="number"
            step="0.1"
            value={formData.distance_km}
            onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
            required
          />

          <Input
            label="Precio"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Dificultad"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
            required
          >
            <option value="facil">Fácil</option>
            <option value="moderado">Moderado</option>
            <option value="dificil">Difícil</option>
            <option value="experto">Experto</option>
          </Select>

          <Select
            label="Estado"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            required
          >
            <option value="borrador">Borrador</option>
            <option value="pendiente_aprobacion">Pendiente Aprobación</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
            <option value="inactiva">Inactiva</option>
          </Select>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : route ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
