import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="layout">
      <div class="layout-glow"></div>

      <app-navbar></app-navbar>

      <main class="content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <div class="footer-container">
          <div class="footer-logo">SOFT CLUB</div>
          <div class="footer-links">Gaming Lounge • Billard • PS5 • VIP</div>
          <div class="footer-copy">© {{ year }} Soft Club</div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .layout {
        position: relative;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background:
          radial-gradient(circle at center, rgba(227, 83, 54, 0.08), transparent 35%),
          linear-gradient(to bottom, #161616 0%, #0b0b0b 100%);
        color: white;
      }

      .layout-glow {
        position: absolute;
        width: 160%;
        height: 160%;
        top: -30%;
        left: -30%;
        background: radial-gradient(
          circle at center,
          rgba(227, 83, 54, 0.42),
          rgba(227, 83, 54, 0.16),
          rgba(227, 83, 54, 0.08),
          transparent 70%
        );
        animation: glowMove 10s ease-in-out infinite alternate;
        filter: blur(12px);
        pointer-events: none;
        z-index: 0;
      }

      .content {
        position: relative;
        z-index: 1;
        flex: 1;
      }

      .footer {
        position: relative;
        z-index: 1;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(0, 0, 0, 0.18);
        backdrop-filter: blur(8px);
        padding: 30px 20px;
      }

      .footer-container {
        max-width: 1200px;
        margin: auto;
        text-align: center;
      }

      .footer-logo {
        font-size: 20px;
        font-weight: 800;
        letter-spacing: 2px;
        margin-bottom: 10px;
      }

      .footer-links {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
        margin-bottom: 10px;
      }

      .footer-copy {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.45);
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
    `,
  ],
})
export class PublicLayoutComponent {
  year = new Date().getFullYear();
}
