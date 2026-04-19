import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import { Event as ClubEvent, EventParticipant } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.scss'],
})
export class StaffDashboardComponent implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = true;
  error = '';

  events: ClubEvent[] = [];
  nextEvent: ClubEvent | null = null;

  pendingParticipantsByEvent: Array<{
    event: ClubEvent;
    pending: EventParticipant[];
  }> = [];

  stats = {
    activeEvents: 0,
    openEvents: 0,
    pendingParticipants: 0,
  };

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = '';
    this.pendingParticipantsByEvent = [];
    this.cdr.detectChanges();

    this.eventService
      .getAllEvents()
      .pipe(
        catchError((err) => {
          console.error('staff getAllEvents error', err);
          this.error = 'Impossible de charger les événements.';
          return of([] as ClubEvent[]);
        }),
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (events) => {
          this.events = [...events].sort(
            (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
          );

          const now = Date.now();

          this.nextEvent =
            this.events.find((event) => new Date(event.startAt).getTime() >= now) ?? null;

          this.stats.activeEvents = this.events.filter((event) => event.active).length;
          this.stats.openEvents = this.events.filter(
            (event) => (event.status || '').toUpperCase() === 'OPEN',
          ).length;

          const activeOrOpenEvents = this.events.filter((event) => {
            const status = (event.status || '').toUpperCase();
            return event.active || status === 'OPEN';
          });

          if (!activeOrOpenEvents.length) {
            this.stats.pendingParticipants = 0;
            this.loading = false;
            this.cdr.detectChanges();
            return;
          }

          let loaded = 0;
          let pendingCount = 0;

          activeOrOpenEvents.forEach((event) => {
            this.eventService
              .getParticipants(event.id)
              .pipe(
                catchError((err) => {
                  console.error(`participants error event ${event.id}`, err);
                  return of([] as EventParticipant[]);
                }),
              )
              .subscribe((participants) => {
                const pending = participants.filter((p) => p.status === 'PENDING');

                if (pending.length) {
                  this.pendingParticipantsByEvent.push({ event, pending });
                  pendingCount += pending.length;
                }

                loaded += 1;

                if (loaded === activeOrOpenEvents.length) {
                  this.stats.pendingParticipants = pendingCount;
                  this.pendingParticipantsByEvent.sort(
                    (a, b) =>
                      new Date(a.event.startAt).getTime() - new Date(b.event.startAt).getTime(),
                  );
                  this.loading = false;
                  this.cdr.detectChanges();
                }
              });
          });

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('staff dashboard error', err);
          this.error = 'Impossible de charger le dashboard staff.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  confirmParticipant(eventId: number, participantId: number): void {
    this.eventService.confirmParticipant(eventId, participantId).subscribe({
      next: () => this.loadDashboard(),
      error: () => {
        this.error = 'Impossible de confirmer ce participant.';
      },
    });
  }

  cancelParticipant(eventId: number, participantId: number): void {
    this.eventService.cancelParticipant(eventId, participantId).subscribe({
      next: () => this.loadDashboard(),
      error: () => {
        this.error = 'Impossible d’annuler ce participant.';
      },
    });
  }

  openEvent(eventId: number): void {
    this.eventService.openEvent(eventId).subscribe({
      next: () => this.loadDashboard(),
      error: () => {
        this.error = 'Impossible d’ouvrir cet événement.';
      },
    });
  }

  closeEvent(eventId: number): void {
    this.eventService.closeEvent(eventId).subscribe({
      next: () => this.loadDashboard(),
      error: () => {
        this.error = 'Impossible de fermer cet événement.';
      },
    });
  }

  getStatusClass(status: string | undefined): string {
    switch ((status || '').toUpperCase()) {
      case 'OPEN':
        return 'badge-open';
      case 'CLOSED':
        return 'badge-closed';
      case 'CANCELLED':
        return 'badge-cancelled';
      default:
        return 'badge-default';
    }
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
}
