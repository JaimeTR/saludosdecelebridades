
import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="text-center py-20">
        <img 
          src="https://picsum.photos/seed/404_notfound_es/400/300" 
          alt="Perdido y Confundido" 
          className="mx-auto mb-8 rounded-lg shadow-lg w-full max-w-md"
        />
        <h1 className="text-6xl font-extrabold text-indigo-700 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">¡Ups! Página No Encontrada.</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          La página que estás buscando no parece existir. Quizás fue movida, o escribiste mal la URL.
        </p>
        <Button onClick={() => window.history.back()} variant="primary" size="lg" className="mr-4">
          Volver Atrás
        </Button>
        <Link to="/">
          <Button variant="secondary" size="lg">
            Ir a la Página Principal
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
};

export default NotFoundPage;
