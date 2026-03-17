import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
