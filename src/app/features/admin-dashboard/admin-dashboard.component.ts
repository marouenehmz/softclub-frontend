import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <section class="admin-dashboard">
      <h1 class="title">Admin Dashboard</h1>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <p class="label">Utilisateurs</p>
          <p class="value">245</p>
        </div>

        <div class="stat-card">
          <p class="label">Réservations</p>
          <p class="value">83</p>
        </div>

        <div class="stat-card">
          <p class="label">Événements</p>
          <p class="value">12</p>
        </div>

        <div class="stat-card">
          <p class="label">Occupation</p>
          <p class="value">74%</p>
        </div>
      </div>

      <!-- Sections admin -->
      <div class="admin-grid">
        <div class="admin-card">
          <h2>Gestion utilisateurs</h2>
          <p>Créer, modifier et supprimer les comptes.</p>
        </div>

        <div class="admin-card">
          <h2>Gestion menu</h2>
          <p>Modifier les boissons, snacks et prix.</p>
        </div>

        <div class="admin-card">
          <h2>Gestion événements</h2>
          <p>Créer des tournois FIFA ou billard.</p>
        </div>

        <div class="admin-card">
          <h2>Statistiques</h2>
          <p>Analyse réservations, fréquentation et IA caméras.</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .admin-dashboard {
        color: white;
      }

      .title {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 30px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
      }

      .stat-card {
        background: #1f1f1f;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 6px;
      }

      .value {
        font-size: 28px;
        font-weight: 700;
      }

      .admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }

      .admin-card {
        background: #1f1f1f;
        padding: 24px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: 0.2s;
        cursor: pointer;
      }

      .admin-card:hover {
        border-color: #9f2d2d;
        transform: translateY(-2px);
      }

      .admin-card h2 {
        margin-bottom: 10px;
        font-size: 18px;
      }

      .admin-card p {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
      }
    `,
  ],
})
export class AdminDashboardComponent {}
