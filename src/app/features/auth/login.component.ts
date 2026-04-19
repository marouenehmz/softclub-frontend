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
  email = '';
  password = '';
  submit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        const role = res.role;

        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (role === 'WORKER') {
          this.router.navigate(['/dashboard/staff']);
        } else if (role === 'VIP') {
          this.router.navigate(['/dashboard/vip']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        alert('Email ou mot de passe incorrect');
      },
    });
  }
}
