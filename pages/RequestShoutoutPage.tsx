
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import RequestForm from '../components/shoutout/RequestForm';
import { useAuth } from '../hooks/useAuth';
import { createShoutoutRequest, confirmPaymentForRequest } from '../services/shoutoutService';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ShoutoutRequest, ShoutoutRequestStatus } from '../types';

const RequestShoutoutPage: React.FC = () => {
  const { packageId: paramPackageId } = useParams<{ packageId?: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<ShoutoutRequest | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);


  const handleSubmitRequest = async (details: {
    packageId: string;
    recipientName: string;
    occasion: string;
    messageDetails: string;
  }) => {
    if (!currentUser) {
      setError("Debes iniciar sesión para realizar una solicitud.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const newRequest = await createShoutoutRequest(
        currentUser.id,
        currentUser.name || currentUser.email,
        details.packageId,
        details.recipientName,
        details.occasion,
        details.messageDetails
      );
      setCreatedRequest(newRequest); 
      setShowSuccessModal(true); 
    } catch (err: any) {
      setError(err.message || 'Error al enviar la solicitud. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!createdRequest) return;
    setIsProcessingPayment(true);
    setError(null); 
    try {
      await confirmPaymentForRequest(createdRequest.id);
      setCreatedRequest(prev => prev ? {...prev, status: ShoutoutRequestStatus.PENDING_APPROVAL} : null);
    } catch (err: any) {
      setError(err.message || 'Error en el pago. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const closeSuccessModalAndRedirect = () => {
    setShowSuccessModal(false);
    setCreatedRequest(null);
    navigate('/my-requests');
  };

  return (
    <PageContainer title="Solicitar un Saludo Personalizado">
      <div className="max-w-2xl mx-auto">
        {error && !showSuccessModal && ( // Only show general error if modal is not for payment error
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <RequestForm
          selectedPackageId={paramPackageId}
          onSubmit={handleSubmitRequest}
          isSubmitting={isSubmitting}
        />
      </div>
      {createdRequest && (
        <Modal
          isOpen={showSuccessModal}
          onClose={createdRequest.status === ShoutoutRequestStatus.PENDING_APPROVAL ? closeSuccessModalAndRedirect : () => {setShowSuccessModal(false); setError(null); setCreatedRequest(null);}}
          title={createdRequest.status === ShoutoutRequestStatus.PENDING_APPROVAL ? "¡Solicitud Enviada!" : "Confirmar Pedido"}
        >
          {createdRequest.status === ShoutoutRequestStatus.PENDING_PAYMENT && !isProcessingPayment && (
            <>
              <p className="text-gray-700 mb-4">¡Tu solicitud para <strong>{createdRequest.recipientName}</strong> ha sido iniciada!</p>
              <p className="text-lg font-semibold mb-1">Paquete: {createdRequest.packageName}</p>
              <p className="text-2xl font-bold text-indigo-600 mb-6">Total: ${createdRequest.packagePrice.toFixed(2)}</p>
              {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md mb-3">{error}</p>}
              <p className="text-sm text-gray-500 mb-4">Por favor, procede a confirmar tu pago. (Este es un paso de pago simulado).</p>
            </>
          )}
          {isProcessingPayment && (
             <div className="flex flex-col items-center justify-center py-6">
                <LoadingSpinner message="Procesando pago..." />
             </div>
          )}
          {createdRequest.status === ShoutoutRequestStatus.PENDING_APPROVAL && !isProcessingPayment && (
             <>
                <p className="text-green-600 font-semibold text-lg mb-4">¡Pago Confirmado!</p>
                <p className="text-gray-700 mb-4">Tu solicitud para <strong>{createdRequest.recipientName}</strong> ha sido enviada exitosamente y ahora está pendiente de aprobación.</p>
                <p className="text-gray-700">Puedes rastrear su estado en "Mis Solicitudes".</p>
             </>
          )}
          
          {createdRequest.status === ShoutoutRequestStatus.PENDING_PAYMENT && (
            <div className="mt-6 flex justify-end space-x-3">
               <Button variant="ghost" onClick={() => { setShowSuccessModal(false); setCreatedRequest(null); setError(null); }}>Cancelar</Button>
               <Button variant="primary" onClick={handleConfirmPayment} isLoading={isProcessingPayment}>
                 {isProcessingPayment ? 'Procesando...' : 'Confirmar y Pagar (Simulado)'}
               </Button>
            </div>
          )}
           {createdRequest.status === ShoutoutRequestStatus.PENDING_APPROVAL && (
            <div className="mt-6 flex justify-end">
               <Button variant="primary" onClick={closeSuccessModalAndRedirect}>
                 Ver Mis Solicitudes
               </Button>
            </div>
          )}
        </Modal>
      )}
    </PageContainer>
  );
};

export default RequestShoutoutPage;
