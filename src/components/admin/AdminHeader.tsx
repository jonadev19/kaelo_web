'use client';

import { Bell, LogOut, User } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Panel de Administración
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Administrador</p>
              <p className="text-xs text-gray-500">admin@rutabicimaya.com</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>

          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
