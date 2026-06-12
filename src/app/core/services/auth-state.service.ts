import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/auth/user.interface';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly USER_KEY = 'spaceia_user';
  private tokenService = inject(TokenService);

  private readonly _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  setCurrentUser(user: User): void {
    this._currentUser.set(user);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  clearSession(): void {
    this._currentUser.set(null);
    sessionStorage.removeItem(this.USER_KEY);
  }

  initializeSession(): void {
    const token = this.tokenService.getToken();
    const storedUser = sessionStorage.getItem(this.USER_KEY);

    if (token && storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        this._currentUser.set(user);
      } catch (e) {
        // Failed to parse user from session storage
        this.clearSession();
        this.tokenService.removeToken();
      }
    } else {
      this.clearSession();
      this.tokenService.removeToken();
    }
  }
}
