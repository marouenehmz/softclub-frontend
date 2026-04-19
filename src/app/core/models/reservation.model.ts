export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED';

export interface Reservation {
  id: number;

  // backend réel
  userId?: number | null;
  roomId?: number;
  roomName?: string | null;
  startAt?: string;
  endAt?: string;
  guestsCount?: number;
  note?: string | null;
  fullName?: string;
  phone?: string;
  status?: ReservationStatus;
  createdAt?: string;

  // compatibilité ancien VIP dashboard
  resourceName?: string;
  date?: string;
  hours?: number;
}

export interface CreateReservationRequest {
  userId?: number | null;
  roomId: number;
  startAt: string;
  endAt: string;
  guestsCount: number;
  note?: string | null;
  fullName: string;
  phone: string;
}
