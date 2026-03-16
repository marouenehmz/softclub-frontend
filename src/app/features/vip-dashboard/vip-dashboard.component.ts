import { Component, computed, inject } from '@angular/core';
import { ReservationService } from '../../core/services/reservation.service';
@Component({
  selector: 'app-vip-dashboard',
  standalone: true,
  template: `
    <section class="text-white">
      <h1 class="mb-6 text-3xl font-bold">Dashboard VIP</h1>
      <div class="mb-6 grid gap-4 md:grid-cols-3">
        <div class="soft-panel p-5">
          <p class="text-sm text-white/60">Heures réservées</p>
          <p class="mt-2 text-3xl font-bold">{{ totalHours() }}h</p>
        </div>
        <div class="soft-panel p-5">
          <p class="text-sm text-white/60">Réservations</p>
          <p class="mt-2 text-3xl font-bold">{{ reservations().length }}</p>
        </div>
        <div class="soft-panel p-5">
          <p class="text-sm text-white/60">Prochaine session</p>
          <p class="mt-2 text-lg font-semibold">{{ nextReservation() }}</p>
        </div>
      </div>
      <div class="soft-panel p-5">
        <h2 class="mb-4 text-xl font-semibold">Historique</h2>
        <div class="space-y-3">
          @for (item of reservations(); track item.id) {
            <div
              class="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3"
            >
              <div>
                <p class="font-medium">{{ item.resourceName }}</p>
                <p class="text-sm text-white/60">{{ item.date }}</p>
              </div>
              <span class="text-sm font-semibold text-[#f4f1ec]">{{ item.hours }}h</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class VipDashboardComponent {
  private reservationService = inject(ReservationService);
  reservations = this.reservationService.reservations;
  totalHours = computed(() => this.reservations().reduce((sum, item) => sum + item.hours, 0));
  nextReservation = computed(() => this.reservations()[0]?.date ?? 'Aucune');
}
