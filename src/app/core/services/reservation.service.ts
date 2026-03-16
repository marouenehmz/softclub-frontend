import { Injectable, signal } from '@angular/core';
import { Reservation } from '../models/reservation.model';
@Injectable({ providedIn: 'root' })
export class ReservationService {
  reservations = signal<Reservation[]>([
    { id: 1, resourceName: 'VIP Room A', date: '18/03/2026 20:00', hours: 2 },
    { id: 2, resourceName: 'VIP Room B', date: '15/03/2026 21:00', hours: 3 },
    { id: 3, resourceName: 'PS5 Lounge', date: '12/03/2026 19:30', hours: 2 },
  ]);
}
