import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="logo">SOFT CLUB</div>

        <div class="subtitle">Dashboard</div>

        <nav>
          <a routerLink="/dashboard/vip" routerLinkActive="active"> Espace VIP </a>

          <a routerLink="/dashboard/staff" routerLinkActive="active"> Espace Staff </a>

          <a routerLink="/"> Retour site </a>
        </nav>
      </aside>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard-layout {
        display: grid;
        grid-template-columns: 260px 1fr;
        min-height: 100vh;
        background: #171717;
        color: white;
      }

      .sidebar {
        background: #111111;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        padding: 30px 20px;
      }

      .logo {
        font-size: 22px;
        font-weight: 800;
        letter-spacing: 2px;
        margin-bottom: 10px;
      }

      .subtitle {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.55);
        margin-bottom: 30px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      nav {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      nav a {
        display: block;
        padding: 12px 14px;
        border-radius: 10px;
        text-decoration: none;
        color: white;
        font-size: 14px;
        transition: 0.2s ease;
      }

      nav a:hover {
        background: #2a2a2a;
      }

      .active {
        background: #9f2d2d;
      }

      .content {
        padding: 40px;
        background:
          radial-gradient(circle at top, rgba(159, 45, 45, 0.12), transparent 30%), #171717;
      }

      @media (max-width: 900px) {
        .dashboard-layout {
          grid-template-columns: 1fr;
        }

        .sidebar {
          padding: 20px;
          border-right: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        nav {
          flex-direction: row;
          flex-wrap: wrap;
        }

        nav a {
          font-size: 13px;
        }

        .content {
          padding: 20px;
        }
      }
    `,
  ],
})
export class DashboardLayoutComponent {}
