import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.API}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('soft_token', res.token);
        localStorage.setItem('soft_role', res.role);
      }),
    );
  }

  getMe() {
    return this.http.get<any>(`${this.API}/me`);
  }

  getToken(): string | null {
    return localStorage.getItem('soft_token');
  }

  getRole(): string | null {
    return localStorage.getItem('soft_role');
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('soft_token');
    localStorage.removeItem('soft_role');
  }
}
