import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized
      if (error.status === 401) {
        // Prepare architecture for token refresh or redirect to login
        // router.navigate(['/auth/login']);
      }
      
      // Handle 403 Forbidden
      if (error.status === 403) {
        // Handle forbidden access
      }

      // Handle Network errors or Unexpected Server errors
      if (error.status === 0 || error.status >= 500) {
        console.error('Un error de red o de servidor ocurrió:', error.message);
      }

      // Propagate the error to the component layer for user-friendly display
      return throwError(() => error);
    })
  );
};
