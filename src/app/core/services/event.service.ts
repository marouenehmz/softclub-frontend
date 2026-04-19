import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateEventRequest,
  Event,
  EventParticipant,
  JoinEventRequest,
  UpdateEventRequest,
} from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/events';

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getActiveEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/active`);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  createEvent(data: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, data);
  }

  updateEvent(id: number, data: UpdateEventRequest): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}`, data);
  }

  openEvent(id: number): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}/open`, {});
  }

  closeEvent(id: number): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}/close`, {});
  }

  cancelEvent(id: number): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}/cancel`, {});
  }

  joinEvent(id: number, data: JoinEventRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/join`, data);
  }
  confirmParticipant(eventId: number, participantId: number) {
    return this.http.patch(
      `${this.apiUrl}/events/${eventId}/participants/${participantId}/confirm`,
      {},
    );
  }
  getParticipants(eventId: number): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(`${this.apiUrl}/${eventId}/participants`);
  }

  cancelParticipant(eventId: number, participantId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${eventId}/participants/${participantId}/cancel`, {});
  }
}
