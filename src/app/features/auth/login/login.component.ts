import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .login-container {
      width: 100%;
    }

    .header {
      margin-bottom: 32px;
    }

    .header h2 {
      font-size: 30px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px;
      letter-spacing: -0.02em;
    }

    .header p {
      font-size: 14px;
      color: #4B5563;
      margin: 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 24px;
    }

    /* Customizing Material Form Field to match design */
    ::ng-deep .auth-field .mat-mdc-text-field-wrapper {
      border-radius: 8px !important;
      background: #fff !important;
      border: 1px solid #E2E8F0 !important;
      padding: 0 12px !important;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    ::ng-deep .auth-field .mdc-line-ripple {
      display: none !important;
    }

    ::ng-deep .auth-field .mat-mdc-form-field-infix {
      padding-top: 12px !important;
      padding-bottom: 12px !important;
      min-height: 48px !important;
      display: flex;
      align-items: center;
    }

    ::ng-deep .auth-field .mat-mdc-text-field-wrapper:focus-within {
      border-color: #004A99 !important;
      box-shadow: 0 0 0 3px rgba(0, 74, 153, 0.1) !important;
    }

    ::ng-deep .auth-field.ng-invalid.ng-touched .mat-mdc-text-field-wrapper {
      border-color: #EF4444 !important;
    }

    ::ng-deep .auth-field input {
      font-size: 14px;
      color: #1F2937;
    }

    ::ng-deep .auth-field input::placeholder {
      color: #9CA3AF;
    }

    ::ng-deep .auth-field mat-icon {
      color: #6B7280;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .field-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .field-label {
      font-size: 13px;
      font-weight: 500;
      color: #374151;
    }

    .forgot-link {
      font-size: 13px;
      font-weight: 600;
      color: #004A99;
      text-decoration: none;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    ::ng-deep .auth-checkbox .mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true]) ~ .mdc-checkbox__background {
      border-color: #D1D5DB;
      border-radius: 4px;
    }

    ::ng-deep .auth-checkbox .mdc-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background {
      background-color: #004A99;
      border-color: #004A99;
    }

    ::ng-deep .auth-checkbox label {
      font-size: 13px;
      color: #374151;
    }

    .submit-btn {
      width: 100%;
      height: 44px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      background-color: #004A99;
      margin-top: 24px;
    }

    .submit-btn:disabled {
      background-color: #93C5FD;
      color: #EFF6FF;
    }

    /* SSO Section */
    .sso-divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 32px 0;
      color: #94A3B8;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .sso-divider::before,
    .sso-divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #E2E8F0;
    }

    .sso-divider:not(:empty)::before {
      margin-right: 16px;
    }

    .sso-divider:not(:empty)::after {
      margin-left: 16px;
    }

    .sso-buttons {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
    }

    .sso-btn {
      flex: 1;
      height: 44px;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
      background: #fff;
      color: #374151;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }

    .sso-btn:hover {
      background: #F8FAFC;
      border-color: #CBD5E1;
    }

    .sso-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #004A99;
    }

    .footer-text {
      text-align: center;
      font-size: 14px;
      color: #4B5563;
    }

    .footer-text a {
      color: #004A99;
      font-weight: 600;
      text-decoration: none;
    }

    .footer-text a:hover {
      text-decoration: underline;
    }
  `],
  template: `
    <div class="login-container">
      <div class="header">
        <h2>Iniciar Sesión</h2>
        <p>Por favor, ingresa tus credenciales universitarias.</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          
          <!-- Email Field -->
          <div>
            <div class="field-label-row">
              <label class="field-label" for="email">Correo Institucional</label>
            </div>
            <mat-form-field class="auth-field w-full" appearance="fill" subscriptSizing="dynamic">
              <mat-icon matPrefix class="mr-2">mail_outline</mat-icon>
              <input 
                matInput 
                id="email" 
                type="email" 
                formControlName="email" 
                placeholder="nombre@spaceia.edu"
                autocomplete="email"
              />
            </mat-form-field>
            @if (loginForm.controls.email.touched && loginForm.controls.email.invalid) {
              <div class="text-red-500 text-xs mt-1">
                @if (loginForm.controls.email.hasError('required')) {
                  El correo es obligatorio.
                }
                @if (loginForm.controls.email.hasError('email')) {
                  Por favor, ingresa un formato de correo válido.
                }
              </div>
            }
          </div>

          <!-- Password Field -->
          <div>
            <div class="field-label-row">
              <label class="field-label" for="password">Contraseña</label>
              <button type="button" class="forgot-link">¿Olvidaste tu contraseña?</button>
            </div>
            <mat-form-field class="auth-field w-full" appearance="fill" subscriptSizing="dynamic">
              <mat-icon matPrefix class="mr-2">lock_outline</mat-icon>
              <input 
                matInput 
                id="password" 
                [type]="hidePassword() ? 'password' : 'text'" 
                formControlName="password" 
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button 
                mat-icon-button 
                matSuffix 
                type="button" 
                (click)="togglePasswordVisibility()" 
                [attr.aria-label]="'Ocultar contraseña'" 
                [attr.aria-pressed]="hidePassword()"
                style="color: #9CA3AF;"
              >
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>
            @if (loginForm.controls.password.touched && loginForm.controls.password.invalid) {
              <div class="text-red-500 text-xs mt-1">
                La contraseña es obligatoria.
              </div>
            }
          </div>
        </div>

        <!-- Remember Me -->
        <mat-checkbox formControlName="rememberMe" class="auth-checkbox">
          Mantener sesión iniciada por 30 días
        </mat-checkbox>

        <!-- Error Message -->
        @if (errorMessage()) {
          <div style="color: #EF4444; font-size: 14px; margin-bottom: 16px; text-align: center; background-color: #FEF2F2; padding: 8px; border-radius: 6px; border: 1px solid #FECACA;">
            {{ errorMessage() }}
          </div>
        }

        <!-- Submit Button -->
        <button 
          mat-flat-button 
          color="primary" 
          type="submit" 
          class="submit-btn" 
          [disabled]="loginForm.invalid || isLoading()"
        >
          {{ isLoading() ? 'Iniciando sesión...' : 'Ingresar al Portal' }}
          @if (!isLoading()) {
            <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          }
        </button>

      </form>

      <!-- SSO Divider -->
      <div class="sso-divider">O INICIA SESIÓN CON SSO</div>

      <!-- SSO Buttons -->
      <div class="sso-buttons">
        <button type="button" class="sso-btn">
          <mat-icon>school</mat-icon>
          EduID
        </button>
        <button type="button" class="sso-btn">
          <mat-icon>fingerprint</mat-icon>
          Identidad Digital
        </button>
      </div>

      <!-- Footer -->
      <div class="footer-text">
        ¿No tienes acceso? <a href="#">Contacta a Admisiones</a>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  hidePassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  togglePasswordVisibility(): void {
    this.hidePassword.update(h => !h);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const credentials = {
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          if (err.status === 401 && err.error && (err.error as any).error) {
            this.errorMessage.set((err.error as any).error);
          } else {
            this.errorMessage.set('Ocurrió un error al iniciar sesión. Intenta nuevamente.');
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
