import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  mobileMenuOpen = false;

  private touchStartX = 0;
  private touchCurrentX = 0;

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
    this.resetTouch();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768) {
      this.mobileMenuOpen = false;
      this.resetTouch();
    }
  }

  onPanelTouchStart(event: TouchEvent): void {
    if (window.innerWidth > 768) return;

    this.touchStartX = event.touches[0].clientX;
    this.touchCurrentX = this.touchStartX;
  }

  onPanelTouchMove(event: TouchEvent): void {
    if (window.innerWidth > 768) return;

    this.touchCurrentX = event.touches[0].clientX;
  }

  onPanelTouchEnd(): void {
    if (window.innerWidth > 768) return;

    const deltaX = this.touchCurrentX - this.touchStartX;

    if (deltaX > 70) {
      this.closeMenu();
    }

    this.resetTouch();
  }

  private resetTouch(): void {
    this.touchStartX = 0;
    this.touchCurrentX = 0;
  }
}
