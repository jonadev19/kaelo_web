export const ROLES = {
  ciclista: 'Ciclista',
  comerciante: 'Comerciante',
  creador_ruta: 'Creador de Rutas',
  administrador: 'Administrador',
} as const;

export const ROUTE_STATUS = {
  borrador: 'Borrador',
  pendiente_aprobacion: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  inactiva: 'Inactiva',
} as const;

export const STORE_STATUS = {
  pendiente_aprobacion: 'Pendiente',
  aprobado: 'Aprobado',
  suspendido: 'Suspendido',
  rechazado: 'Rechazado',
} as const;

export const DIFFICULTY_LEVELS = {
  facil: 'Fácil',
  moderado: 'Moderado',
  dificil: 'Difícil',
  experto: 'Experto',
} as const;

export const PAYMENT_STATUS = {
  pendiente: 'Pendiente',
  completado: 'Completado',
  fallido: 'Fallido',
  reembolsado: 'Reembolsado',
} as const;
