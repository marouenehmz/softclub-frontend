import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  CreateReservationRequest,
  Reservation,
  ReservationStatus,
} from '../../core/models/reservation.model';
import { ReservationService } from '../../core/services/reservation.service';

@Component({
  selector: 'app-staff-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgClass],
  templateUrl: './staff-reservations.component.html',
  styleUrl: './staff-reservations.component.scss',
})
export class StaffReservationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reservationService = inject(ReservationService);

  loading = signal(true);
  saving = signal(false);
  error = signal('');
  success = signal('');

  reservations = signal<Reservation[]>([]);
  selectedStatus = signal<'ALL' | ReservationStatus>('ALL');

  readonly filteredReservations = computed(() => {
    const status = this.selectedStatus();
    const items = this.reservations();

    if (status === 'ALL') return items;
    return items.filter((item) => item.status === status);
  });

  readonly stats = computed(() => {
    const data = this.reservations();

    return {
      total: data.length,
      pending: data.filter((r) => r.status === 'PENDING').length,
      confirmed: data.filter((r) => r.status === 'CONFIRMED').length,
      cancelled: data.filter((r) => r.status === 'CANCELLED' || r.status === 'REJECTED').length,
    };
  });

  readonly form = this.fb.group({
    roomId: [1, [Validators.required, Validators.min(1)]],
    startAt: ['', Validators.required],
    endAt: ['', Validators.required],
    guestsCount: [2, [Validators.required, Validators.min(1)]],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    note: [''],
  });

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading.set(true);
    this.error.set('');

    this.reservationService
      .getAllReservations()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          this.reservations.set(
            [...data].sort((a, b) => {
              const dateA = a.startAt ? new Date(a.startAt).getTime() : 0;
              const dateB = b.startAt ? new Date(b.startAt).getTime() : 0;
              return dateB - dateA;
            }),
          );
        },
        error: () => {
          this.error.set('Impossible de charger les réservations.');
        },
      });
  }
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    const payload: CreateReservationRequest = {
      userId: null,
      roomId: Number(this.form.value.roomId),
      startAt: this.form.value.startAt!,
      endAt: this.form.value.endAt!,
      guestsCount: Number(this.form.value.guestsCount),
      fullName: this.form.value.fullName!.trim(),
      phone: this.form.value.phone!.trim(),
      note: this.form.value.note?.trim() || null,
    };

    this.reservationService
      .createReservation(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.success.set('Réservation créée avec succès.');
          this.form.reset({
            roomId: 1,
            startAt: '',
            endAt: '',
            guestsCount: 2,
            fullName: '',
            phone: '',
            note: '',
          });
          this.loadReservations();
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Création impossible.');
        },
      });
  }

  approve(id: number): void {
    this.reservationService.approveReservation(id).subscribe({
      next: () => this.loadReservations(),
      error: () => this.error.set('Impossible de confirmer cette réservation.'),
    });
  }

  reject(id: number): void {
    this.reservationService.rejectReservation(id).subscribe({
      next: () => this.loadReservations(),
      error: () => this.error.set('Impossible de refuser cette réservation.'),
    });
  }

  setFilter(status: 'ALL' | ReservationStatus): void {
    this.selectedStatus.set(status);
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  getStatusClass(status: ReservationStatus): string {
    switch (status) {
      case 'PENDING':
        return 'badge-pending';
      case 'CONFIRMED':
        return 'badge-confirmed';
      case 'CANCELLED':
      case 'REJECTED':
        return 'badge-cancelled';
      default:
        return 'badge-default';
    }
  }
}
