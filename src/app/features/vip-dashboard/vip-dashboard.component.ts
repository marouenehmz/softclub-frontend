import { Component, computed, inject } from '@angular/core';
import { ReservationService } from '../../core/services/reservation.service';
@Component({
  selector: 'app-vip-dashboard',
  standalone: true,
  templateUrl: './vip-dashboard.component.html',
  styleUrls: ['./vip-dashboard.component.scss'],
})
export class VipDashboardComponent {
  private reservationService = inject(ReservationService);
  reservations = this.reservationService.reservations;
  totalHours = computed(() => this.reservations().reduce((sum, item) => sum + item.hours, 0));
  nextReservation = computed(() => this.reservations()[0]?.date ?? 'Aucune');
}
