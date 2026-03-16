import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">SOFT CLUB</div>

        <nav>
          <a routerLink="/admin" routerLinkActive="active"> Dashboard </a>

          <a routerLink="/admin/users" routerLinkActive="active"> Utilisateurs </a>

          <a routerLink="/admin/reservations" routerLinkActive="active"> Réservations </a>

          <a routerLink="/admin/events" routerLinkActive="active"> Événements </a>

          <a routerLink="/admin/menu" routerLinkActive="active"> Menu </a>

          <a routerLink="/"> Retour site </a>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .admin-layout {
        display: grid;
        grid-template-columns: 260px 1fr;
        min-height: 100vh;
        background: #171717;
        color: white;
      }

      .sidebar {
        background: #111;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        padding: 30px 20px;
      }

      .logo {
        font-size: 22px;
        font-weight: 800;
        margin-bottom: 40px;
        letter-spacing: 2px;
      }

      nav {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      nav a {
        padding: 12px 14px;
        border-radius: 10px;
        text-decoration: none;
        color: white;
        font-size: 14px;
        transition: 0.2s;
      }

      nav a:hover {
        background: #2a2a2a;
      }

      .active {
        background: #9f2d2d;
      }

      .content {
        padding: 40px;
      }

      @media (max-width: 900px) {
        .admin-layout {
          grid-template-columns: 1fr;
        }

        .sidebar {
          display: flex;
          overflow-x: auto;
        }

        nav {
          flex-direction: row;
        }
      }
    `,
  ],
})
export class AdminLayoutComponent {}
