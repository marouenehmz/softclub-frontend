import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Reservation,
  CreateReservationRequest,
  ReservationStatus,
} from '../models/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/reservations';

  // Compatibilité temporaire avec le dashboard VIP actuel
  reservations = signal<Reservation[]>([
    { id: 1, resourceName: 'VIP Room A', date: '18/03/2026 20:00', hours: 2 },
    { id: 2, resourceName: 'VIP Room B', date: '15/03/2026 21:00', hours: 3 },
    { id: 3, resourceName: 'PS5 Lounge', date: '12/03/2026 19:30', hours: 2 },
  ]);

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getReservationsByStatus(status: ReservationStatus): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/status/${status}`);
  }

  createReservation(data: CreateReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, data);
  }

  approveReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/admin/${id}/approve`, {});
  }

  rejectReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/admin/${id}/reject`, {});
  }

  cancelReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
