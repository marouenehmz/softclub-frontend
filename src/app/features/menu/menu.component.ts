import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  template: `
    <section class="menu-page">
      <div class="container">
        <h1 class="title">Menu</h1>

        <!-- Boissons -->
        <div class="menu-section">
          <h2>Boissons</h2>

          <div class="menu-list">
            <div class="menu-item">
              <span>Café</span>
              <span>2.50€</span>
            </div>

            <div class="menu-item">
              <span>Thé</span>
              <span>2.50€</span>
            </div>

            <div class="menu-item">
              <span>Jus d'orange</span>
              <span>3.00€</span>
            </div>

            <div class="menu-item">
              <span>Mojito sans alcool</span>
              <span>5.50€</span>
            </div>
          </div>
        </div>

        <!-- Snacks -->
        <div class="menu-section">
          <h2>Snacks</h2>

          <div class="menu-list">
            <div class="menu-item">
              <span>Panini</span>
              <span>5.00€</span>
            </div>

            <div class="menu-item">
              <span>Pizza</span>
              <span>8.00€</span>
            </div>

            <div class="menu-item">
              <span>Frites</span>
              <span>4.00€</span>
            </div>

            <div class="menu-item">
              <span>Dessert</span>
              <span>4.50€</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .menu-page {
        padding: 60px 20px;
        color: white;
      }

      .container {
        max-width: 1000px;
        margin: auto;
      }

      .title {
        font-size: 40px;
        font-weight: 700;
        margin-bottom: 40px;
        text-align: center;
      }

      .menu-section {
        margin-bottom: 40px;
        background: #1f1f1f;
        padding: 30px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .menu-section h2 {
        margin-bottom: 20px;
        font-size: 24px;
      }

      .menu-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .menu-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 16px;
        background: #2a2a2a;
        border-radius: 8px;
        font-size: 16px;
      }
    `,
  ],
})
export class MenuComponent {}
