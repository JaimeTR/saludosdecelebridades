
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import PageContainer from '../components/common/PageContainer';
import { UserRole } from '../types';
import { GoogleIcon, APP_NAME } from '../constants';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        if (user.role === UserRole.ADMIN) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
         setError('Inicio de sesión fallido. Por favor revisa tus credenciales.');
      }
    } catch (err: any) {
      setError(err.message || 'Inicio de sesión fallido. Por favor revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = () => {
    // Mock Google Login
    setError('El inicio de sesión con Google no está implementado en esta demo.');
  };


  return (
    <PageContainer>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-4xl font-extrabold text-indigo-700">
              Inicia sesión en {APP_NAME}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              O{' '}
              <Link to="/register" className="font-medium text-pink-600 hover:text-pink-500">
                crea una nueva cuenta
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div>
              <Button type="submit" isLoading={loading} className="w-full" variant="primary" size="lg">
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>
           <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continuar con</span>
              </div>
            </div>
            <div className="mt-6">
              <Button 
                onClick={handleGoogleLogin} 
                variant="ghost" 
                className="w-full"
                leftIcon={<GoogleIcon />}
              >
                Iniciar sesión con Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default LoginPage;
