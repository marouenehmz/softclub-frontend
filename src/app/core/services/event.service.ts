import { Injectable, signal } from '@angular/core';
import { ClubEvent } from '../models/event.model';
@Injectable({ providedIn: 'root' })
export class EventService {
  events = signal<ClubEvent[]>([
    {
      id: 1,
      title: 'Tournoi FIFA Night',
      category: 'PS5',
      description: 'Compétition nocturne avec classement et récompenses.',
      date: 'Vendredi 21:00',
    },
    {
      id: 2,
      title: 'Soft Billiard Cup',
      category: 'Billard',
      description: 'Tournoi billard ouvert à tous les niveaux.',
      date: 'Samedi 18:00',
    },
    {
      id: 3,
      title: 'Soirée Match',
      category: 'Sports',
      description: 'Retransmission en ambiance lounge avec formule snack.',
      date: 'Dimanche 20:45',
    },
  ]);
}
