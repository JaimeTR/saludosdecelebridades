
import { ShoutoutRequest, ShoutoutRequestStatus } from '../types';
import { PACKAGES } from '../constants';

const SHOUTOUT_REQUESTS_KEY = 'celebriSaludos_shoutoutRequests';

const getStoredRequests = (): ShoutoutRequest[] => {
  const requestsJson = localStorage.getItem(SHOUTOUT_REQUESTS_KEY);
  return requestsJson ? JSON.parse(requestsJson) : [];
};

const saveRequests = (requests: ShoutoutRequest[]) => {
  localStorage.setItem(SHOUTOUT_REQUESTS_KEY, JSON.stringify(requests));
};

export const createShoutoutRequest = async (
  userId: string,
  userName: string,
  packageId: string,
  recipientName: string,
  occasion: string,
  messageDetails: string
): Promise<ShoutoutRequest> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  const selectedPackage = PACKAGES.find(p => p.id === packageId);
  if (!selectedPackage) {
    throw new Error('Paquete seleccionado no encontrado');
  }

  const newRequest: ShoutoutRequest = {
    id: `req_${Date.now()}`,
    userId,
    userName,
    packageId,
    packageName: selectedPackage.name,
    packagePrice: selectedPackage.price,
    recipientName,
    occasion,
    messageDetails,
    status: ShoutoutRequestStatus.PENDING_PAYMENT, // Initial status
    requestedAt: new Date().toISOString(),
  };
  const requests = getStoredRequests();
  requests.push(newRequest);
  saveRequests(requests);
  return newRequest;
};

// Simulate payment confirmation
export const confirmPaymentForRequest = async (requestId: string): Promise<ShoutoutRequest> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate payment processing
  const requests = getStoredRequests();
  const requestIndex = requests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    throw new Error('Solicitud no encontrada');
  }
  requests[requestIndex].status = ShoutoutRequestStatus.PENDING_APPROVAL;
  saveRequests(requests);
  return requests[requestIndex];
}

export const getRequestsByUserId = async (userId: string): Promise<ShoutoutRequest[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const requests = getStoredRequests();
  return requests.filter(req => req.userId === userId).sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
};

export const getAllRequests = async (): Promise<ShoutoutRequest[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getStoredRequests().sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
};

export const getRequestById = async (requestId: string): Promise<ShoutoutRequest | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const requests = getStoredRequests();
  return requests.find(req => req.id === requestId);
}

export const updateRequestStatus = async (
  requestId: string, 
  status: ShoutoutRequestStatus, 
  adminNotes?: string, 
  videoUrl?: string,
  celebrityMessageToFan?: string,
  aiImageConceptUrl?: string // New parameter
): Promise<ShoutoutRequest> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const requests = getStoredRequests();
  const requestIndex = requests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    throw new Error('Solicitud no encontrada');
  }
  requests[requestIndex].status = status;
  if (adminNotes !== undefined) requests[requestIndex].adminNotes = adminNotes; // Allow empty string

  if (status === ShoutoutRequestStatus.COMPLETED) {
    if (videoUrl) requests[requestIndex].videoUrl = videoUrl;
    if (celebrityMessageToFan !== undefined) requests[requestIndex].celebrityMessageToFan = celebrityMessageToFan;
    if (aiImageConceptUrl) requests[requestIndex].aiImageConceptUrl = aiImageConceptUrl;
  } else {
    // Clear these fields if status is no longer completed
    requests[requestIndex].videoUrl = undefined;
    requests[requestIndex].celebrityMessageToFan = undefined;
    requests[requestIndex].aiImageConceptUrl = undefined;
  }
  
  saveRequests(requests);
  return requests[requestIndex];
};