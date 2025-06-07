
import React from 'react';
import { ShoutoutPackage } from './types';

export const APP_NAME = "CelebriSaludos";

export const PACKAGES: ShoutoutPackage[] = [
  {
    id: 'pkg_basic_01',
    name: 'Saludo Rápido',
    description: 'Un videomensaje personalizado, corto y dulce.',
    price: 49.99,
    features: ['Video Personalizado', 'Entrega en 7 días', 'Hasta 30 segundos'],
    image: 'https://picsum.photos/seed/pkg_basic_01/400/300',
  },
  {
    id: 'pkg_standard_02',
    name: 'Saludo Estándar',
    description: 'Un videomensaje más detallado para cualquier ocasión.',
    price: 99.99,
    features: ['Video Personalizado', 'Entrega en 5 días', 'Hasta 60 segundos', 'Calidad HD'],
    image: 'https://picsum.photos/seed/pkg_standard_02/400/300',
  },
  {
    id: 'pkg_premium_03',
    name: 'Experiencia Premium',
    description: 'El saludo definitivo con características extra.',
    price: 199.99,
    features: ['Video Personalizado', 'Entrega en 3 días', 'Hasta 90 segundos', 'Calidad Full HD', 'Soporte Prioritario'],
    image: 'https://picsum.photos/seed/pkg_premium_03/400/300',
  },
];

export const MOCK_ADMIN_USER_ID = 'admin_user_001';
export const MOCK_ADMIN_EMAIL = 'admin@celebri.greet'; // Keep email as is for login consistency

// Heroicons SVGs (aria-label or title could be added if needed for accessibility in Spanish)
export const UserCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg aria-label="Ícono de usuario" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const ArrowRightOnRectangleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg aria-label="Ícono de cerrar sesión o ingresar" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
 <svg aria-label="Ícono de brillos o magia" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L24 5.25l-.813 2.846a4.5 4.5 0 0 0-3.09 3.09L17.25 12l2.846.813a4.5 4.5 0 0 0 3.09 3.09L24 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L18.25 12Z" />
</svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg aria-label="Ícono de inicio" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const DocumentTextIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg aria-label="Ícono de documento" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

export const InboxIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg aria-label="Ícono de bandeja de entrada" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
  </svg>
);

export const GiftIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
 <svg aria-label="Ícono de regalo" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.85l.708.707a2.25 2.25 0 0 1 0 3.182l-.707.707a2.25 2.25 0 0 1-3.182 0l-.707-.707a2.25 2.25 0 0 1-.405-.85v-.568c0-.481.158-.94.44-.132A1.904 1.904 0 0 0 10.5 3.798V3.03c0-.703.57-1.273 1.273-1.273.703 0 1.273.57 1.273 1.273ZM12.75 3.03L12.75 5.25M12.75 5.25v2.25M12.75 5.25H15M12.75 5.25H10.5m4.25 5.5c0 .148-.02.293-.057.433-2.189.9-.432 2.342-2.343 2.343s-1.454-2.29-2.343-2.343A.998.998 0 0 1 9.25 10.5c0-.552.448-1 1-1h3c.552 0 1 .448 1 1Zm-2.25-2.625c.623 0 1.125.502 1.125 1.125v.004c0 .623-.502 1.125-1.125 1.125H11.5c-.623 0-1.125-.502-1.125-1.125v-.004c0-.623.502-1.125 1.125-1.125h1Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.03 23.03 0 0 1 12 15.002a23.03 23.03 0 0 1-9-1.747M21 13.255v2.884c0 3.525-2.904 6.387-6.481 6.387h-5.037C5.904 22.526 3 19.663 3 16.139v-2.884" />
</svg>
);

export const Cog6ToothIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg aria-label="Ícono de configuración" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 1.905c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-1.905c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="Ícono de Google">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

// Helper to translate status for display
export const translateShoutoutRequestStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING_PAYMENT: 'PAGO PENDIENTE',
    PENDING_APPROVAL: 'PENDIENTE DE APROBACIÓN',
    APPROVED: 'APROBADO',
    RECORDING: 'GRABANDO',
    COMPLETED: 'COMPLETADO',
    REJECTED: 'RECHAZADO',
    CANCELLED: 'CANCELADO',
    ALL: 'TODOS'
  };
  return statusMap[status] || status;
};
