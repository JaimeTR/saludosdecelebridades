import React from 'react';
import { ShoutoutRequest, ShoutoutRequestStatus } from '../../types';
import { Link } from 'react-router-dom';
import { translateShoutoutRequestStatus } from '../../constants';

interface RequestTableProps {
  requests: ShoutoutRequest[];
  onStatusChange: (requestId: string, newStatus: ShoutoutRequestStatus) => void;
  onRequestVideoUrl: (requestId: string) => void; // Callback to open modal for video URL
}

const getStatusPillClasses = (status: ShoutoutRequestStatus): string => {
  // These classes will apply to the select element itself
  switch (status) {
    case ShoutoutRequestStatus.PENDING_PAYMENT: return 'bg-yellow-100 text-yellow-800 border-yellow-400 focus:ring-yellow-500';
    case ShoutoutRequestStatus.PENDING_APPROVAL: return 'bg-blue-100 text-blue-800 border-blue-400 focus:ring-blue-500';
    case ShoutoutRequestStatus.APPROVED: return 'bg-indigo-100 text-indigo-800 border-indigo-400 focus:ring-indigo-500';
    case ShoutoutRequestStatus.RECORDING: return 'bg-purple-100 text-purple-800 border-purple-400 focus:ring-purple-500';
    case ShoutoutRequestStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-400 focus:ring-green-500';
    case ShoutoutRequestStatus.REJECTED:
    case ShoutoutRequestStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-400 focus:ring-red-500';
    default: return 'bg-gray-100 text-gray-800 border-gray-400 focus:ring-gray-500';
  }
};


const RequestTable: React.FC<RequestTableProps> = ({ requests, onStatusChange, onRequestVideoUrl }) => {
  if (requests.length === 0) {
    return <p className="text-center text-gray-500 py-8">No se encontraron solicitudes.</p>;
  }

  const handleLocalStatusChange = (requestId: string, newStatus: ShoutoutRequestStatus) => {
    if (newStatus === ShoutoutRequestStatus.COMPLETED) {
      // Check if the request already has a video URL. If so, don't prompt again unless necessary.
      // For simplicity in this direct table change, we can always call onRequestVideoUrl, 
      // and the modal can be enhanced later to show existing URL or prefill.
      // Or, only call if no URL exists. Let's keep current logic: prompt if changing to COMPLETED.
      const currentRequest = requests.find(r => r.id === requestId);
      // If it's already completed and has a URL, changing status to completed again (perhaps via other means) might not need new URL.
      // However, this handler is for explicit change TO completed.
      onRequestVideoUrl(requestId); 
    } else {
      onStatusChange(requestId, newStatus);
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destinatario
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fan
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paquete
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ocasión
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Solicitado el
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Ver</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{request.recipientName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{request.userName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{request.packageName}</div>
                <div className="text-xs text-gray-500">${request.packagePrice.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{request.occasion}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={request.status}
                  onChange={(e) => handleLocalStatusChange(request.id, e.target.value as ShoutoutRequestStatus)}
                  className={`w-full text-xs leading-5 font-semibold rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusPillClasses(request.status)}`}
                  aria-label={`Estado actual: ${translateShoutoutRequestStatus(request.status)}. Cambiar estado.`}
                >
                  {Object.values(ShoutoutRequestStatus).map(sVal => (
                    <option 
                      key={sVal} 
                      value={sVal} 
                      // Style options for better legibility if select has dark/colored background
                      // This styling is often browser-dependent for <option> tags
                      style={{ backgroundColor: 'white', color: 'black' }} 
                    >
                      {translateShoutoutRequestStatus(sVal)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(request.requestedAt).toLocaleDateString('es-ES')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link to={`/admin/request/${request.id}`} className="text-indigo-600 hover:text-indigo-900">
                  Ver Detalles
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;