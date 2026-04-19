import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { Event as ClubEvent, EventParticipant } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';
import { MediaService } from '../../core/services/media.service';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.scss',
})
export class AdminEventsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly eventService = inject(EventService);
  private readonly mediaService = inject(MediaService);

  events: ClubEvent[] = [];
  participants: EventParticipant[] = [];

  loading = true;
  saving = false;
  loadingParticipants = false;

  error = '';
  successMessage = '';
  participantError = '';

  selectedEventId: number | null = null;
  editingEvent: ClubEvent | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    startAt: ['', Validators.required],
    endAt: ['', Validators.required],
    maxParticipants: [16, [Validators.required, Validators.min(1)]],
    price: [null as number | null],
    type: [''],
    active: [true],
  });

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = '';

    this.eventService
      .getAllEvents()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (events) => {
          this.events = events;
        },
        error: () => {
          this.error = 'Impossible de charger les événements.';
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;

    if (!file) {
      this.imagePreview = this.editingEvent?.imageUrl || null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  editEvent(event: ClubEvent): void {
    this.editingEvent = event;
    this.selectedFile = null;
    this.imagePreview = event.imageUrl || null;

    this.form.patchValue({
      title: event.title,
      description: event.description,
      startAt: this.toDateTimeLocal(event.startAt),
      endAt: this.toDateTimeLocal(event.endAt),
      maxParticipants: event.maxParticipants,
      price: event.price ?? null,
      type: event.type ?? '',
      active: event.active,
    });
  }

  resetForm(): void {
    this.editingEvent = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.successMessage = '';

    this.form.reset({
      title: '',
      description: '',
      startAt: '',
      endAt: '',
      maxParticipants: 16,
      price: null,
      type: '',
      active: true,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    if (this.selectedFile) {
      this.mediaService.uploadImage(this.selectedFile, 'EVENT').subscribe({
        next: (res) => this.saveEvent(res.url),
        error: () => {
          this.saving = false;
          this.error = 'Upload de l’image impossible.';
        },
      });
      return;
    }

    this.saveEvent(this.editingEvent?.imageUrl ?? null);
  }

  saveEvent(imageUrl: string | null): void {
    const payload = {
      title: this.form.value.title!.trim(),
      description: this.form.value.description!.trim(),
      startAt: this.form.value.startAt!,
      endAt: this.form.value.endAt!,
      maxParticipants: Number(this.form.value.maxParticipants),
      price: this.form.value.price ?? null,
      imageUrl,
      type: this.form.value.type?.trim() || null,
      active: this.form.value.active ?? true,
    };

    const request$ = this.editingEvent
      ? this.eventService.updateEvent(this.editingEvent.id, payload)
      : this.eventService.createEvent(payload);

    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.successMessage = this.editingEvent
          ? 'Événement modifié avec succès.'
          : 'Événement créé avec succès.';
        this.resetForm();
        this.loadEvents();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Enregistrement impossible.';
      },
    });
  }

  openEvent(event: ClubEvent): void {
    this.eventService.openEvent(event.id).subscribe({
      next: () => this.loadEvents(),
      error: () => (this.error = 'Impossible d’ouvrir l’événement.'),
    });
  }

  closeEvent(event: ClubEvent): void {
    this.eventService.closeEvent(event.id).subscribe({
      next: () => this.loadEvents(),
      error: () => (this.error = 'Impossible de fermer l’événement.'),
    });
  }

  cancelEvent(event: ClubEvent): void {
    this.eventService.cancelEvent(event.id).subscribe({
      next: () => this.loadEvents(),
      error: () => (this.error = 'Impossible d’annuler l’événement.'),
    });
  }

  confirmParticipant(participant: EventParticipant): void {
    if (!this.selectedEventId) return;

    this.eventService.confirmParticipant(this.selectedEventId, participant.id).subscribe(() => {
      this.loadParticipants(this.selectedEventId!);
    });
  }

  loadParticipants(eventId: number): void {
    this.loadingParticipants = true;
    this.participantError = '';

    this.eventService.getParticipants(eventId).subscribe({
      next: (res) => {
        this.participants = res;
        this.loadingParticipants = false;
      },
      error: () => {
        this.participantError = 'Erreur chargement participants';
        this.loadingParticipants = false;
      },
    });
  }

  showParticipants(event: ClubEvent): void {
    this.selectedEventId = event.id;
    this.loadParticipants(event.id);
  }

  cancelParticipant(participant: EventParticipant): void {
    if (!this.selectedEventId) return;

    this.eventService.cancelParticipant(this.selectedEventId, participant.id).subscribe({
      next: () => this.showParticipants({ id: this.selectedEventId } as ClubEvent),
      error: () => {
        this.participantError = 'Impossible d’annuler ce participant.';
      },
    });
  }

  getStatusClass(event: ClubEvent): string {
    if ((event.remainingSpots ?? 0) <= 0) return 'badge-full';
    const status = (event.status || '').toUpperCase();
    if (status === 'OPEN') return 'badge-open';
    if (status === 'CLOSED') return 'badge-closed';
    if (status === 'CANCELLED') return 'badge-cancelled';
    return 'badge-default';
  }

  toDateTimeLocal(value: string): string {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60_000);
    return local.toISOString().slice(0, 16);
  }
  getParticipantStatusClass(p: EventParticipant): string {
    switch (p.status) {
      case 'PENDING':
        return 'status-pending';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  }
  formatDate(value: string): string {
    return new Date(value).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
}
