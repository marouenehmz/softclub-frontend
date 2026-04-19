export interface Event {
  id: number;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  maxParticipants: number;
  registeredParticipants: number;
  remainingSpots: number;
  price?: number;
  imageUrl?: string;
  type?: string;
  status: string;
  active: boolean;
}

export interface EventParticipant {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  status: string;
}

export interface JoinEventRequest {
  fullName: string;
  phone: string;
  email?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  maxParticipants: number;
  price?: number | null;
  imageUrl?: string | null;
  type?: string | null;
  active?: boolean;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  maxParticipants?: number;
  price?: number | null;
  imageUrl?: string | null;
  type?: string | null;
  active?: boolean;
}
