
import React from 'react';
import { ShoutoutRequest, ShoutoutRequestStatus } from '../../types';
import { Link } from 'react-router-dom';
import { translateShoutoutRequestStatus } from '../../constants';

interface RequestListItemProps {
  request: ShoutoutRequest;
  isAdminView?: boolean;
}

const getStatusColor = (status: ShoutoutRequestStatus): string => {
  switch (status) {
    case ShoutoutRequestStatus.PENDING_PAYMENT:
      return 'bg-yellow-100 text-yellow-800';
    case ShoutoutRequestStatus.PENDING_APPROVAL:
      return 'bg-blue-100 text-blue-800';
    case ShoutoutRequestStatus.APPROVED:
      return 'bg-indigo-100 text-indigo-800';
    case ShoutoutRequestStatus.RECORDING:
      return 'bg-purple-100 text-purple-800';
    case ShoutoutRequestStatus.COMPLETED:
      return 'bg-green-100 text-green-800';
    case ShoutoutRequestStatus.REJECTED:
    case ShoutoutRequestStatus.CANCELLED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const RequestListItem: React.FC<RequestListItemProps> = ({ request, isAdminView = false }) => {
  const displayStatus = translateShoutoutRequestStatus(request.status);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-indigo-700">
            Solicitud para {request.recipientName}
          </h3>
          <p className="text-sm text-gray-500">
            Paquete: {request.packageName} (${request.packagePrice.toFixed(2)})
          </p>
          {isAdminView && <p className="text-sm text-gray-500">Solicitado por: {request.userName} ({request.userId})</p>}
        </div>
        <span
          className={`px-3 py-1 mt-2 sm:mt-0 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}
        >
          {displayStatus}
        </span>
      </div>
      <div className="mb-4">
        <p className="text-gray-700"><strong>Ocasión:</strong> {request.occasion}</p>
        <p className="text-gray-700 mt-1"><strong>Detalles del Mensaje:</strong></p>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
          {request.messageDetails}
        </p>
      </div>

      {!isAdminView && request.status === ShoutoutRequestStatus.COMPLETED && (
        <div className="my-4 pt-4 border-t">
          <h4 className="text-lg font-semibold text-green-700 mb-3">¡Tu Saludo Está Listo!</h4>
          
          {request.aiImageConceptUrl && (
            <div className="mb-4">
                <p className="font-semibold text-gray-700 mb-2">Un Concepto Visual para Ti:</p>
                <img 
                    src={request.aiImageConceptUrl} 
                    alt="Concepto visual del saludo" 
                    className="w-full max-w-md mx-auto rounded-lg shadow-md object-contain max-h-80" 
                    onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
                />
            </div>
          )}

          {request.videoUrl && (
            <div className="mb-3">
              <div className="aspect-w-16 aspect-h-9 mb-2">
                 <video controls src={request.videoUrl} className="w-full rounded-md shadow" onError={(e) => (e.currentTarget.outerHTML = '<p class="text-red-500">Error al cargar el video. Intenta descargarlo.</p>') }>
                    Tu navegador no soporta la etiqueta de video. 
                    <a href={request.videoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Descarga el video aquí.</a>
                 </video>
              </div>
               <a
                  href={request.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm"
                >
                  Abrir video en nueva pestaña
                </a>
            </div>
          )}
           
          {(request.celebrityMessageToFan || request.adminNotes) && ( 
            <>
              <p className="font-semibold mt-3 text-gray-700">Mensaje del Famoso:</p>
              <p className="text-sm text-gray-600 bg-indigo-50 p-3 rounded-md whitespace-pre-wrap">
                {request.celebrityMessageToFan || request.adminNotes}
              </p>
            </>
          )}
          {!request.videoUrl && !request.celebrityMessageToFan && !request.aiImageConceptUrl && (
             <p className="text-gray-600">Los detalles de tu saludo completado se mostrarán aquí pronto.</p>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500 pt-2">
        <p>Solicitado el: {new Date(request.requestedAt).toLocaleDateString('es-ES')}</p>
        {isAdminView ? (
          <Link
            to={`/admin/request/${request.id}`}
            className="mt-2 sm:mt-0 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Ver Detalles &rarr;
          </Link>
        ) : (
          request.status === ShoutoutRequestStatus.COMPLETED && !request.videoUrl && !request.aiImageConceptUrl && ( // Adjusted condition
             <p className="mt-2 sm:mt-0 text-green-600 font-semibold">Video/detalles completados, pero no disponibles para mostrar.</p>
          )
        )}
         {!isAdminView && request.status !== ShoutoutRequestStatus.COMPLETED && (
            <p className="mt-2 sm:mt-0 text-gray-500">El video y detalles estarán disponibles aquí una vez completado.</p>
         )}
      </div>

      {request.adminNotes && isAdminView && !request.celebrityMessageToFan && ( 
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700">Notas Administrativas:</p>
          <p className="text-xs text-gray-600 bg-yellow-50 p-2 rounded-md whitespace-pre-wrap">{request.adminNotes}</p>
        </div>
      )}
    </div>
  );
};

export default RequestListItem;