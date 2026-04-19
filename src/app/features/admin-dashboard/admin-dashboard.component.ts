import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { Event as ClubEvent } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = true;
  error = '';

  events: ClubEvent[] = [];
  activeEvents: ClubEvent[] = [];

  stats = {
    totalEvents: 0,
    activeEvents: 0,
    openEvents: 0,
    totalParticipants: 0,
    averageFillRate: 0,
  };

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    forkJoin({
      allEvents: this.eventService.getAllEvents().pipe(
        catchError((err) => {
          console.error('getAllEvents error', err);
          return of([] as ClubEvent[]);
        }),
      ),
      activeEvents: this.eventService.getActiveEvents().pipe(
        catchError((err) => {
          console.error('getActiveEvents error', err);
          return of([] as ClubEvent[]);
        }),
      ),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ allEvents, activeEvents }) => {
          this.events = [...allEvents].sort(
            (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime(),
          );

          this.activeEvents = [...activeEvents].sort(
            (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
          );

          const totalParticipants = allEvents.reduce(
            (sum, event) => sum + (event.registeredParticipants ?? 0),
            0,
          );

          const fillRates = allEvents
            .filter((event) => (event.maxParticipants ?? 0) > 0)
            .map((event) => ((event.registeredParticipants ?? 0) / event.maxParticipants) * 100);

          const averageFillRate = fillRates.length
            ? Math.round(fillRates.reduce((sum, value) => sum + value, 0) / fillRates.length)
            : 0;

          this.stats = {
            totalEvents: allEvents.length,
            activeEvents: activeEvents.length,
            openEvents: allEvents.filter((event) => (event.status || '').toUpperCase() === 'OPEN')
              .length,
            totalParticipants,
            averageFillRate,
          };

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('admin dashboard error', err);
          this.error = 'Impossible de charger le dashboard admin.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }
}
