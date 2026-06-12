import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../models/auth/login-request.interface';
import { LoginResponse } from '../models/auth/login-response.interface';
import { TokenService } from './token.service';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private authStateService = inject(AuthStateService);
  
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // 1. Store accessToken
        this.tokenService.saveToken(response.accessToken);
        // 2. Update authenticated user state
        this.authStateService.setCurrentUser(response.user);
      })
    );
  }

  logout(): void {
    // 1. Remove accessToken
    this.tokenService.removeToken();
    // 2. Remove stored user & 3. Clear AuthStateService & 4. Reset authentication state
    this.authStateService.clearSession();
    // Redirect architecture will be handled by the component or a router guard
  }
}
