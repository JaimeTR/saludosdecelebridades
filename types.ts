
export enum UserRole {
  FAN = 'FAN', // Fan
  ADMIN = 'ADMIN', // Administrador
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export enum ShoutoutRequestStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT', // PAGO PENDIENTE
  PENDING_APPROVAL = 'PENDING_APPROVAL', // PENDIENTE DE APROBACIÓN
  APPROVED = 'APPROVED', // APROBADO
  RECORDING = 'RECORDING', // GRABANDO
  COMPLETED = 'COMPLETED', // COMPLETADO
  REJECTED = 'REJECTED', // RECHAZADO
  CANCELLED = 'CANCELLED', // CANCELADO
}

export interface ShoutoutPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  image: string;
}

export interface ShoutoutRequest {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  recipientName: string;
  occasion: string;
  messageDetails: string;
  status: ShoutoutRequestStatus;
  requestedAt: string; // ISO Date string
  targetDeliveryDate?: string; // ISO Date string
  videoUrl?: string;
  adminNotes?: string; // For internal admin use or potentially celebrity message
  celebrityMessageToFan?: string; // Specific message from celebrity to fan for completed videos
  aiImageConceptUrl?: string; // URL of the AI-generated image concept for the fan
}

export interface CartItem extends ShoutoutPackage {
  // For a potential cart feature, not fully implemented here
}