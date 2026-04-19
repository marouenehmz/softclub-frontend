import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Event } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
})
export class EventDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly eventService = inject(EventService);
  private readonly cdr = inject(ChangeDetectorRef);

  event: Event | null = null;
  loading = true;
  error = '';
  submitting = false;
  successMessage = '';
  submitError = '';

  readonly joinForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    email: ['', [Validators.email]],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.loading = false;
      this.error = 'Événement introuvable.';
      this.cdr.detectChanges();
      return;
    }

    this.loadEvent(id);
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.eventService
      .getEventById(id)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (event) => {
          console.log('DETAIL EVENT RESPONSE =>', event);
          this.event = event;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('DETAIL EVENT ERROR =>', err);
          this.error = 'Impossible de charger cet événement.';
          this.cdr.detectChanges();
        },
      });
  }

  submitJoin(): void {
    if (!this.event || this.joinForm.invalid || this.isJoinDisabled()) {
      this.joinForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const eventId = this.event.id;

    this.submitting = true;
    this.submitError = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.eventService
      .joinEvent(eventId, {
        fullName: this.joinForm.value.fullName!.trim(),
        phone: this.joinForm.value.phone!.trim(),
        email: this.joinForm.value.email?.trim() || undefined,
      })
      .pipe(
        finalize(() => {
          this.submitting = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Inscription enregistrée avec succès.';
          this.joinForm.reset();
          this.cdr.detectChanges();

          setTimeout(() => {
            this.loadEvent(eventId);
          }, 0);
        },
        error: (err) => {
          console.error('JOIN EVENT ERROR =>', err);
          this.submitError = err?.error?.message || 'Impossible de finaliser l’inscription.';
          this.cdr.detectChanges();
        },
      });
  }

  isFull(): boolean {
    return !!this.event && (this.event.remainingSpots ?? 0) <= 0;
  }

  isJoinDisabled(): boolean {
    if (!this.event) return true;

    const status = (this.event.status || '').toUpperCase();
    return this.isFull() || status === 'CLOSED' || status === 'CANCELLED' || status === 'DRAFT';
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  }

  getStatusLabel(): string {
    if (!this.event) return 'EVENT';
    if (this.isFull()) return 'FULL';

    const status = (this.event.status || '').toUpperCase();
    if (status === 'OPEN') return 'OPEN';
    if (status === 'CLOSED') return 'CLOSED';
    if (status === 'CANCELLED') return 'ANNULÉ';
    if (status === 'DRAFT') return 'BROUILLON';
    return status || 'EVENT';
  }

  getStatusClass(): string {
    if (!this.event) return 'badge-default';
    if (this.isFull()) return 'badge-full';

    const status = (this.event.status || '').toUpperCase();
    if (status === 'OPEN') return 'badge-open';
    if (status === 'CLOSED') return 'badge-closed';
    if (status === 'CANCELLED') return 'badge-cancelled';
    if (status === 'DRAFT') return 'badge-default';
    return 'badge-default';
  }

  getEventBackground(): string {
    if (this.event?.imageUrl) {
      return `linear-gradient(to top, rgba(10,10,12,.92), rgba(10,10,12,.28)), url('${this.event.imageUrl}')`;
    }

    return `linear-gradient(135deg, rgba(227,83,54,.22), rgba(20,20,24,.9))`;
  }

  getEventShape(): string {
    const type = (this.event?.type || '').toUpperCase();

    if (type.includes('FIFA')) return '△';
    if (type.includes('BILLARD')) return '□';
    if (type.includes('VIP')) return '○';

    return '✦';
  }
}
