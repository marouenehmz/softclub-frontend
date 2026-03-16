import { Injectable, signal } from '@angular/core';
import { UserRole } from '../models/user.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('soft_token'));
  private roleSignal = signal<UserRole | null>(
    (localStorage.getItem('soft_role') as UserRole | null) ?? null,
  );
  isLoggedIn(): boolean {
    return !!this.token();
  }
  role(): UserRole | null {
    return this.roleSignal();
  }
  login(token: string, role: UserRole): void {
    localStorage.setItem('soft_token', token);
    localStorage.setItem('soft_role', role);
    this.token.set(token);
    this.roleSignal.set(role);
  }
  logout(): void {
    localStorage.removeItem('soft_token');
    localStorage.removeItem('soft_role');
    this.token.set(null);
    this.roleSignal.set(null);
  }
  getToken(): string | null {
    return this.token();
  }
}
