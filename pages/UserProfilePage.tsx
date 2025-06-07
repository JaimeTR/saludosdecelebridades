
import React, { useEffect, useState } from 'react';
import PageContainer from '../components/common/PageContainer';
import { useAuth } from '../hooks/useAuth';
import { getRequestsByUserId } from '../services/shoutoutService';
import { ShoutoutRequest } from '../types';
import RequestListItem from '../components/shoutout/RequestListItem';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const UserProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<ShoutoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          setError(null);
          const userRequests = await getRequestsByUserId(currentUser.id);
          setRequests(userRequests);
        } catch (err: any) {
          setError(err.message || 'Error al cargar las solicitudes.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser]);

  if (loading) {
    return <PageContainer title="Mis Solicitudes de Saludos"><LoadingSpinner message="Buscando tus solicitudes..." /></PageContainer>;
  }

  if (error) {
    return <PageContainer title="Mis Solicitudes de Saludos"><p className="text-red-500 text-center">{error}</p></PageContainer>;
  }
  
  if (!currentUser) {
     return <PageContainer title="Mis Solicitudes de Saludos"><p className="text-center">Por favor, inicia sesión para ver tus solicitudes.</p></PageContainer>;
  }

  return (
    <PageContainer title="Mis Solicitudes de Saludos">
      {requests.length === 0 ? (
        <div className="text-center py-10">
          <img 
            src="https://picsum.photos/seed/empty_requests_es/400/300" // picsum might return different sizes, so max-w is important
            alt="Sin solicitudes" 
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-6 rounded-lg shadow-md object-cover" 
          />
          <p className="text-xl text-gray-600 mb-4">Aún no has realizado ninguna solicitud de saludo.</p>
          <Button variant="primary" onClick={() => navigate('/request-shoutout')}>
            ¡Haz Tu Primera Solicitud!
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <RequestListItem key={request.id} request={request} isAdminView={false} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default UserProfilePage;