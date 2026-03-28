import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Skip auth header for auth endpoints themselves
    const isAuthEndpoint =
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/refresh');

    const token = authService.getAccessToken();

    const authReq = token && !isAuthEndpoint
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401 && !isAuthEndpoint) {
                const refresh = authService.getRefreshToken();
                if (refresh) {
                    // Try to refresh once, then retry original request
                    return authService.refreshToken().pipe(
                        switchMap(() => {
                            const newToken = authService.getAccessToken();
                            const retried = req.clone({
                                setHeaders: { Authorization: `Bearer ${newToken}` },
                            });
                            return next(retried);
                        }),
                        catchError((refreshErr) => {
                            authService.clearTokens();
                            router.navigate(['/auth/login']);
                            return throwError(() => refreshErr);
                        }),
                    );
                }
                authService.clearTokens();
                router.navigate(['/auth/login']);
            }
            return throwError(() => err);
        }),
    );
};
