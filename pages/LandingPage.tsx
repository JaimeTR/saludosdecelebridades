
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { APP_NAME, SparklesIcon } from '../constants';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LandingPage: React.FC = () => {
  const { currentUser, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    }
  }, [currentUser, isAdmin, loading, navigate]);

  if (loading || currentUser) { 
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500 p-6">
        <LoadingSpinner message="Cargando tu experiencia..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-pink-600 text-white p-6">
      <header className="text-center mb-12">
        <SparklesIcon className="h-24 w-24 text-yellow-300 mx-auto mb-4" />
        <h1 className="text-6xl font-extrabold tracking-tight mb-4">
          ¡Bienvenido a <span className="text-yellow-300">{APP_NAME}!</span>
        </h1>
        <p className="text-2xl text-indigo-200 max-w-2xl mx-auto">
          Obtén videomensajes personalizados de tu famoso favorito para cualquier ocasión especial.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-300">Para Fans</h2>
          <p className="mb-6 text-lg">
            Sorprende a tus seres queridos con un regalo único que nunca olvidarán. ¡Fácil de solicitar, memorable de recibir!
          </p>
          <Button onClick={() => navigate('/home')} variant="primary" size="lg" className="w-full sm:w-auto">
            Explorar Paquetes
          </Button>
        </div>
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-300">Para Famosos</h2>
          <p className="mb-6 text-lg">
            Conecta con tus fans a un nivel personal y gestiona todas tus solicitudes de saludos en un solo lugar.
          </p>
          <Button onClick={() => navigate('/login')} variant="secondary" size="lg" className="w-full sm:w-auto">
            Acceso Admin
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-indigo-300">¿Nuevo aquí? <Link to="/register" className="font-bold text-yellow-300 hover:underline">Crea una Cuenta</Link></p>
      </div>
    </div>
  );
};

export default LandingPage;
