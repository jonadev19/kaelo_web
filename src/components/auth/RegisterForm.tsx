'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Ciclista');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password, rol }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.token);
        router.push('/admin');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Error al registrarse.');
      }
    } catch (error) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <Input
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Select
        label="Rol"
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        required
      >
        <option value="Ciclista">Ciclista</option>
        <option value="Comerciante">Comerciante</option>
        <option value="Creador de Ruta">Creador de Ruta</option>
      </Select>
      <Button type="submit" variant="primary" className="w-full">
        Registrarse
      </Button>
      <div className="text-center pt-4">
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </div>
    </form>
  );
}
