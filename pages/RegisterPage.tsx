
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import PageContainer from '../components/common/PageContainer';
import { GoogleIcon, APP_NAME } from '../constants';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await register(email, password, name);
      if(user){
        navigate('/home'); 
      } else {
        setError('Registro fallido. Por favor, intenta de nuevo.');
      }
    } catch (err: any) {
      setError(err.message || 'Registro fallido. Ocurrió un error desconocido.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleRegister = () => {
    setError('El registro con Google no está implementado en esta demo.');
  };

  return (
    <PageContainer>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-4xl font-extrabold text-indigo-700">
              Crea tu cuenta en {APP_NAME}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">
                Inicia Sesión
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            <Input
              label="Nombre Completo"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
            />
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (mín. 6 caracteres)"
            />
            <Input
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div>
              <Button type="submit" isLoading={loading} className="w-full" variant="primary" size="lg">
                {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
              </Button>
            </div>
          </form>
           <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O regístrate con</span>
              </div>
            </div>
            <div className="mt-6">
               <Button 
                onClick={handleGoogleRegister} 
                variant="ghost" 
                className="w-full"
                leftIcon={<GoogleIcon />}
              >
                Registrarse con Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default RegisterPage;
