
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME, ArrowRightOnRectangleIcon, UserCircleIcon, HomeIcon, DocumentTextIcon, InboxIcon, GiftIcon, SparklesIcon } from '../../constants';
import Button from './Button';

const Navbar: React.FC = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center text-white hover:opacity-80 transition-opacity">
              <SparklesIcon className="h-10 w-10 mr-2 text-yellow-300" />
              <span className="font-bold text-3xl tracking-tight">{APP_NAME}</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                {isAdmin ? (
                  <>
                    <NavLink to="/admin/dashboard" icon={<InboxIcon className="w-5 h-5"/>}>Dashboard</NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/home" icon={<HomeIcon className="w-5 h-5"/>}>Inicio</NavLink>
                    <NavLink to="/my-requests" icon={<DocumentTextIcon className="w-5 h-5"/>}>Mis Solicitudes</NavLink>
                    <NavLink to="/request-shoutout" icon={<GiftIcon className="w-5 h-5"/>}>Solicitar Saludo</NavLink>
                  </>
                )}
                <div className="text-white text-sm hidden md:block">
                  Hola, {currentUser.name || currentUser.email.split('@')[0]}
                </div>
                <Button onClick={handleLogout} variant="secondary" size="sm" leftIcon={<ArrowRightOnRectangleIcon className="w-5 h-5"/>}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" icon={<ArrowRightOnRectangleIcon className="w-5 h-5"/>}>Iniciar Sesión</NavLink>
                <NavLink to="/register" icon={<UserCircleIcon className="w-5 h-5"/>}>Registrarse</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, icon }) => (
  <Link
    to={to}
    className="text-gray-100 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center space-x-2"
  >
    {icon}
    <span>{children}</span>
  </Link>
);


export default Navbar;
