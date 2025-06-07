
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import PackageCard from '../components/shoutout/PackageCard';
import { PACKAGES } from '../constants';
import { useAuth } from '../hooks/useAuth';

const FanHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSelectPackage = (packageId: string) => {
    navigate(`/request-shoutout/${packageId}`);
  };
  
  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Fan';

  return (
    <PageContainer title={`¡Bienvenido/a, ${userName}!`}>
      <div className="mb-10 text-center">
        <p className="text-xl text-gray-700">¿Listo/a para obtener un saludo personalizado?</p>
        <p className="text-md text-gray-500">¡Explora nuestros paquetes exclusivos a continuación y haz que el día de alguien sea especial!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PACKAGES.map((pkg) => (
          <PackageCard key={pkg.id} packageInfo={pkg} onSelect={handleSelectPackage} />
        ))}
      </div>
    </PageContainer>
  );
};

export default FanHomePage;
