import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div class="w-full max-w-md soft-panel p-8">
        <h1 class="mb-2 text-3xl font-black uppercase">Connexion</h1>
        <p class="mb-6 text-white/70">Accès VIP, staff ou admin.</p>
        <form class="space-y-4" (ngSubmit)="submit()">
          <input
            [(ngModel)]="email"
            name="email"
            class="soft-input"
            type="email"
            placeholder="Email"
          />
          <input
            [(ngModel)]="password"
            name="password"
            class="soft-input"
            type="password"
            placeholder="Mot de passe"
          />
          <button class="soft-btn w-full" type="submit">Se connecter</button>
        </form>
      </div>
    </section>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  email = 'admin@softclub.com';
  password = 'demo';
  submit(): void {
    if (this.email.includes('admin')) {
      this.authService.login('fake-admin-token', 'ADMIN');
      this.router.navigateByUrl('/admin');
      return;
    }
    if (this.email.includes('staff')) {
      this.authService.login('fake-staff-token', 'STAFF');
      this.router.navigateByUrl('/dashboard/staff');
      return;
    }
    this.authService.login('fake-vip-token', 'VIP');
    this.router.navigateByUrl('/dashboard/vip');
  }
}
