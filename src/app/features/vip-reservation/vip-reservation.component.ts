import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-vip-reservation',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="soft-container py-16">
      <div class="mx-auto max-w-3xl soft-panel p-8">
        <h1 class="mb-2 text-3xl font-black uppercase">Réservation VIP</h1>
        <p class="mb-8 text-white/70">Réserve un salon VIP ou un espace privé à l'étage.</p>
        <form class="grid gap-4 md:grid-cols-2">
          <input class="soft-input" type="text" placeholder="Nom complet" />
          <input class="soft-input" type="tel" placeholder="Téléphone" />
          <input class="soft-input" type="date" />
          <input class="soft-input" type="time" />
          <select class="soft-input">
            <option>Salle VIP droite</option>
            <option>Salle VIP gauche</option>
            <option>Espace PS5</option>
          </select>
          <select class="soft-input">
            <option>2 heures</option>
            <option>3 heures</option>
            <option>4 heures</option>
          </select>
          <textarea
            class="soft-input md:col-span-2"
            rows="5"
            placeholder="Détails complémentaires"
          ></textarea>
          <div class="md:col-span-2">
            <button type="button" class="soft-btn">Envoyer la demande</button>
          </div>
        </form>
      </div>
    </section>
  `,
})
export class VipReservationComponent {}
