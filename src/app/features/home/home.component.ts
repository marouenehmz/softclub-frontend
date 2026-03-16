import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="home-page">
      <div class="glow-bg"></div>

      <div class="soft-container content">
        <div class="left">
          <p class="tagline">Gaming Lounge • Billard • VIP • PS5</p>

          <h1 class="brand-title">SOFT CLUB</h1>

          <h2 class="headline">Le club premium pour jouer, réserver et vivre l'ambiance Soft.</h2>

          <p class="description">
            Réservation VIP, coin PS5, billard et expérience lounge moderne dans un univers rouge,
            noir et industriel.
          </p>

          <div class="actions">
            <a routerLink="/vip" class="soft-btn">Réserver un espace</a>
            <a routerLink="/menu" class="soft-btn-outline">Voir le menu</a>
          </div>
        </div>

        <div class="right">
          <article
            #billardCard
            class="feature-card ps-square"
            tabindex="0"
            (mousemove)="onCardMove($event, billardCard)"
            (mouseleave)="resetCardLetters(billardCard)"
          >
            <div class="ps-shape">□</div>
            <div class="feature-content">
              <h3 class="split-title">
                @for (letter of billardLetters; track $index) {
                  <span class="letter">{{ letter === ' ' ? ' ' : letter }}</span>
                }
              </h3>
              <p>Tables premium et ambiance moderne.</p>
            </div>
          </article>

          <article
            #vipCard
            class="feature-card ps-circle"
            tabindex="0"
            (mousemove)="onCardMove($event, vipCard)"
            (mouseleave)="resetCardLetters(vipCard)"
          >
            <div class="ps-shape">○</div>
            <div class="feature-content">
              <h3 class="split-title">
                @for (letter of vipLetters; track $index) {
                  <span class="letter">{{ letter === ' ' ? ' ' : letter }}</span>
                }
              </h3>
              <p>Réservations privées à l'étage.</p>
            </div>
          </article>

          <article
            #ps5Card
            class="feature-card ps-triangle"
            tabindex="0"
            (mousemove)="onCardMove($event, ps5Card)"
            (mouseleave)="resetCardLetters(ps5Card)"
          >
            <div class="ps-shape">△</div>
            <div class="feature-content">
              <h3 class="split-title">
                @for (letter of ps5Letters; track $index) {
                  <span class="letter">{{ letter === ' ' ? ' ' : letter }}</span>
                }
              </h3>
              <p>Espace gaming dédié.</p>
            </div>
          </article>

          <article
            #premiumCard
            class="feature-card ps-cross"
            tabindex="0"
            (mousemove)="onCardMove($event, premiumCard)"
            (mouseleave)="resetCardLetters(premiumCard)"
          >
            <div class="ps-shape">✕</div>
            <div class="feature-content">
              <h3 class="split-title">
                @for (letter of premiumLetters; track $index) {
                  <span class="letter">{{ letter === ' ' ? ' ' : letter }}</span>
                }
              </h3>
              <p>Un espace lounge pensé pour le confort et le jeu.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .home-page {
        position: relative;
        min-height: 100vh;
        overflow: hidden;
        background:
          radial-gradient(circle at center, rgba(227, 83, 54, 0.08), transparent 35%),
          linear-gradient(to bottom, #161616 0%, #0b0b0b 100%);
        display: flex;
        align-items: center;
      }

      .glow-bg {
        position: absolute;
        width: 160%;
        height: 160%;
        top: -30%;
        left: -30%;
        background: radial-gradient(
          circle at center,
          rgba(227, 83, 54, 0.5),
          rgba(227, 83, 54, 0.18),
          rgba(227, 83, 54, 0.08),
          transparent 70%
        );
        animation: glowMove 10s ease-in-out infinite alternate;
        filter: blur(10px);
        pointer-events: none;
      }

      .content {
        position: relative;
        z-index: 2;
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 2rem;
        align-items: center;
        min-height: 100vh;
        padding-top: 3rem;
        padding-bottom: 3rem;
      }

      .left {
        max-width: 680px;
      }

      .tagline {
        margin-bottom: 1rem;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.35em;
        color: rgba(244, 241, 236, 0.72);
      }

      .brand-title {
        margin: 0 0 1rem 0;
        font-size: clamp(3.5rem, 10vw, 7rem);
        line-height: 0.9;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #e35336;
        text-shadow:
          0 0 8px rgba(227, 83, 54, 0.95),
          0 0 18px rgba(227, 83, 54, 0.85),
          0 0 35px rgba(227, 83, 54, 0.7),
          0 0 60px rgba(227, 83, 54, 0.45);
        animation: fireGlow 2.2s ease-in-out infinite alternate;
      }

      .headline {
        margin: 0 0 1.2rem 0;
        font-size: clamp(1.5rem, 3vw, 3rem);
        line-height: 1.05;
        font-weight: 800;
        color: white;
      }

      .description {
        margin: 0 0 2rem 0;
        max-width: 560px;
        font-size: 1.05rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.78);
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .right {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.9rem;
      }

      .feature-card {
        position: relative;
        min-height: 165px;
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background:
          linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015)),
          linear-gradient(135deg, rgba(227, 83, 54, 0.16), rgba(0, 0, 0, 0.42));
        backdrop-filter: blur(10px);
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease,
          border-color 0.3s ease;
        cursor: pointer;
        isolation: isolate;
      }

      .feature-card:hover,
      .feature-card:focus,
      .feature-card:focus-within {
        transform: translateY(-4px) scale(1.01);
        border-color: rgba(227, 83, 54, 0.45);
        box-shadow:
          0 14px 32px rgba(0, 0, 0, 0.3),
          0 0 20px rgba(227, 83, 54, 0.14);
        outline: none;
      }

      .ps-shape {
        position: absolute;
        right: 12px;
        bottom: -6px;
        font-size: 5rem;
        line-height: 1;
        font-weight: 700;
        opacity: 0.16;
        z-index: 0;
        transition:
          transform 0.35s ease,
          opacity 0.35s ease;
        user-select: none;
        pointer-events: none;
      }

      .feature-card:hover .ps-shape,
      .feature-card:focus .ps-shape,
      .feature-card:focus-within .ps-shape {
        transform: scale(1.08) rotate(-4deg);
        opacity: 0.28;
      }

      .feature-content {
        position: relative;
        z-index: 2;
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: flex-end;
        padding: 1.1rem;
      }

      .split-title {
        display: flex;
        flex-wrap: wrap;
        gap: 0.01em;
        margin: 0 0 0.55rem 0;
        font-size: 1.1rem;
        font-weight: 800;
        color: white;
        line-height: 1.15;
      }

      .letter {
        display: inline-block;
        transition: transform 0.22s ease-out;
        will-change: transform;
      }

      .feature-content p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.78);
      }

      .ps-square .ps-shape {
        color: #4cc9f0;
        text-shadow:
          0 0 12px rgba(76, 201, 240, 0.45),
          0 0 28px rgba(76, 201, 240, 0.25);
      }

      .ps-circle .ps-shape {
        color: #ff6b6b;
        text-shadow:
          0 0 12px rgba(255, 107, 107, 0.45),
          0 0 28px rgba(255, 107, 107, 0.25);
      }

      .ps-triangle .ps-shape {
        color: #72efdd;
        text-shadow:
          0 0 12px rgba(114, 239, 221, 0.45),
          0 0 28px rgba(114, 239, 221, 0.25);
      }

      .ps-cross .ps-shape {
        color: #b388ff;
        text-shadow:
          0 0 12px rgba(179, 136, 255, 0.45),
          0 0 28px rgba(179, 136, 255, 0.25);
      }

      @keyframes glowMove {
        0% {
          transform: translate(-8%, -6%) scale(1);
        }
        50% {
          transform: translate(6%, 4%) scale(1.15);
        }
        100% {
          transform: translate(-4%, 8%) scale(1.05);
        }
      }

      @keyframes fireGlow {
        0% {
          text-shadow:
            0 0 6px rgba(227, 83, 54, 0.9),
            0 0 14px rgba(227, 83, 54, 0.75),
            0 0 28px rgba(227, 83, 54, 0.55),
            0 0 44px rgba(227, 83, 54, 0.35);
        }
        50% {
          text-shadow:
            0 0 10px rgba(227, 83, 54, 1),
            0 0 24px rgba(227, 83, 54, 0.95),
            0 0 44px rgba(227, 83, 54, 0.78),
            0 0 74px rgba(227, 83, 54, 0.52);
        }
        100% {
          text-shadow:
            0 0 8px rgba(227, 83, 54, 0.95),
            0 0 18px rgba(227, 83, 54, 0.85),
            0 0 35px rgba(227, 83, 54, 0.68),
            0 0 60px rgba(227, 83, 54, 0.4);
        }
      }

      @media (max-width: 1024px) {
        .content {
          grid-template-columns: 1fr;
          padding-top: 5rem;
          padding-bottom: 4rem;
        }
      }

      @media (max-width: 640px) {
        .right {
          grid-template-columns: 1fr;
        }

        .actions {
          flex-direction: column;
          align-items: stretch;
        }

        .ps-shape {
          font-size: 4.2rem;
        }
      }
    `,
  ],
})
export class HomeComponent {
  billardLetters = 'Zone Billard'.split('');
  vipLetters = 'VIP Lounge'.split('');
  ps5Letters = 'Zone PS5'.split('');
  premiumLetters = 'Expérience premium'.split('');

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
