import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  billardLetters = 'Zone Billard'.split('');
  vipLetters = 'VIP Lounge'.split('');
  ps5Letters = 'Zone PS5'.split('');
  premiumLetters = 'Expérience Premium'.split('');

  onCardMove(event: MouseEvent, card: HTMLElement): void {
    if (!card) return;

    const letters = card.querySelectorAll('.letter');
    if (!letters.length) return;

    const rect = card.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    letters.forEach((letter) => {
      const el = letter as HTMLElement;
      const r = el.getBoundingClientRect();

      const letterX = r.left - rect.left + r.width / 2;
      const letterY = r.top - rect.top + r.height / 2;

      const dx = letterX - mouseX;
      const dy = letterY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      const maxDistance = 110;
      const strength = Math.max(0, (maxDistance - distance) / maxDistance);

      const moveX = (dx / distance) * strength * 12;
      const moveY = (dy / distance) * strength * 12;

      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }

  resetCardLetters(card: HTMLElement): void {
    if (!card) return;

    const letters = card.querySelectorAll('.letter');
    letters.forEach((letter) => {
      (letter as HTMLElement).style.transform = 'translate(0, 0)';
    });
  }
}
