import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Event } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.scss',
})
export class EventsListComponent implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly cdr = inject(ChangeDetectorRef);

  events: Event[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.eventService
      .getActiveEvents()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (events) => {
          this.events = events.filter(
            (event) =>
              event.status === 'OPEN' || event.status === 'CLOSED' || event.status === 'FULL',
          );
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Impossible de charger les événements pour le moment.';
          this.cdr.detectChanges();
        },
      });
  }

  getStatusLabel(event: Event): string {
    if (this.isFull(event)) return 'FULL';

    const status = (event.status || '').toUpperCase();
    if (status === 'OPEN') return 'OPEN';
    if (status === 'CLOSED') return 'CLOSED';
    if (status === 'CANCELLED') return 'ANNULÉ';
    if (status === 'DRAFT') return 'BROUILLON';
    return status || 'EVENT';
  }

  getStatusClass(event: Event): string {
    if (this.isFull(event)) return 'badge-full';

    const status = (event.status || '').toUpperCase();
    if (status === 'OPEN') return 'badge-open';
    if (status === 'CLOSED') return 'badge-closed';
    if (status === 'CANCELLED') return 'badge-cancelled';
    if (status === 'DRAFT') return 'badge-default';
    return 'badge-default';
  }

  isFull(event: Event): boolean {
    return (event.remainingSpots ?? 0) <= 0;
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
  getEventBackground(event: Event): string {
    if (event.imageUrl) {
      return `linear-gradient(to top, rgba(10,10,12,.92), rgba(10,10,12,.28)), url('${event.imageUrl}')`;
    }

    return `linear-gradient(135deg, rgba(227,83,54,.22), rgba(20,20,24,.9))`;
  }

  getEventShape(event: Event): string {
    const type = (event.type || '').toUpperCase();

    if (type.includes('FIFA')) return '△';
    if (type.includes('BILLARD')) return '□';
    if (type.includes('VIP')) return '○';

    return '✦';
  }
}
