
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PageContainer from '../components/common/PageContainer';
import { getAllRequests, updateRequestStatus } from '../services/shoutoutService';
import { ShoutoutRequest, ShoutoutRequestStatus } from '../types';
import RequestTable from '../components/admin/RequestTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { translateShoutoutRequestStatus } from '../constants';

const AdminDashboardPage: React.FC = () => {
  const [allRequests, setAllRequests] = useState<ShoutoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ShoutoutRequestStatus | 'ALL'>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequestIdForVideo, setCurrentRequestIdForVideo] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);

  const fetchAllRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const requests = await getAllRequests();
      setAllRequests(requests);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchAllRequests();
  }, [fetchAllRequests]);

  const handleStatusChange = async (requestId: string, newStatus: ShoutoutRequestStatus, videoUrlForComplete?: string) => {
    setIsUpdatingStatus(true);
    setStatusUpdateError(null);
    try {
      const updatedReq = await updateRequestStatus(requestId, newStatus, undefined, videoUrlForComplete); // Admin notes managed in detail page for now
      setAllRequests(prevRequests => 
        prevRequests.map(req => req.id === requestId ? updatedReq : req)
      );
    } catch (err: any) {
      setStatusUpdateError(err.message || 'Error al actualizar el estado.');
      // Re-fetch to ensure data consistency if update failed partially or state is complex
      fetchAllRequests(); 
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const openVideoUrlModal = (requestId: string) => {
    setCurrentRequestIdForVideo(requestId);
    setVideoUrl(''); // Reset previous URL
    setIsModalOpen(true);
  };

  const handleVideoUrlSubmit = () => {
    if (currentRequestIdForVideo && videoUrl.trim()) {
      handleStatusChange(currentRequestIdForVideo, ShoutoutRequestStatus.COMPLETED, videoUrl.trim());
      setIsModalOpen(false);
      setCurrentRequestIdForVideo(null);
      setVideoUrl('');
    } else if (currentRequestIdForVideo) { // If URL is empty but trying to complete
       handleStatusChange(currentRequestIdForVideo, ShoutoutRequestStatus.COMPLETED, undefined); // Allow completing without URL via modal too
       setIsModalOpen(false);
       setCurrentRequestIdForVideo(null);
       setVideoUrl('');
    }
  };


  const filteredRequests = useMemo(() => {
    if (filter === 'ALL') {
      return allRequests;
    }
    return allRequests.filter(req => req.status === filter);
  }, [allRequests, filter]);
  
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allRequests.length };
    Object.values(ShoutoutRequestStatus).forEach(status => {
      counts[status] = allRequests.filter(req => req.status === status).length;
    });
    return counts;
  }, [allRequests]);


  if (loading) {
    return <PageContainer title="Admin Dashboard - Todas las Solicitudes"><LoadingSpinner message="Cargando todas las solicitudes..." /></PageContainer>;
  }

  if (error) {
    return <PageContainer title="Admin Dashboard - Todas las Solicitudes"><p className="text-red-500 text-center">{error}</p></PageContainer>;
  }

  return (
    <PageContainer title="Admin Dashboard - Solicitudes de Saludos">
      {statusUpdateError && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{statusUpdateError}</p>}
      <div className="mb-6 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Filtrar por Estado:</h3>
        <div className="flex flex-wrap gap-2">
          {(['ALL'] as (ShoutoutRequestStatus | 'ALL')[]).concat(Object.values(ShoutoutRequestStatus)).map(statusValue => (
            <button
              key={statusValue}
              onClick={() => setFilter(statusValue)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${filter === statusValue 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {translateShoutoutRequestStatus(statusValue)} ({statusCounts[statusValue] || 0})
            </button>
          ))}
        </div>
      </div>
      <RequestTable 
        requests={filteredRequests} 
        onStatusChange={handleStatusChange}
        onRequestVideoUrl={openVideoUrlModal}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ingresar URL del Video"
      >
        <Input
          label="URL del Video"
          name="videoUrlModal"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://ejemplo.com/video.mp4"
        />
        <p className="text-xs text-gray-500 mt-1 mb-3">Este campo es opcional. Puedes completar la solicitud sin una URL de video aquí y añadirla más tarde en los detalles.</p>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleVideoUrlSubmit} isLoading={isUpdatingStatus}>
            {isUpdatingStatus ? 'Actualizando...' : 'Confirmar y Completar'}
          </Button>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default AdminDashboardPage;
