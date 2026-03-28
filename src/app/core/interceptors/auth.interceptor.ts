import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Эндпоинты, которым НЕ нужен Bearer токен
const PUBLIC_ENDPOINTS = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
];

function isPublic(url: string): boolean {
    return PUBLIC_ENDPOINTS.some((e) => url.includes(e));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Получаем токен напрямую из localStorage — без inject(AuthService)
    // чтобы избежать circular dependency при инициализации
    const token = localStorage.getItem('rohnamo_access_token');
    const router = inject(Router);

    // /auth/me в конструкторе передаёт заголовок вручную — не дублируем
    const alreadyHasAuth = req.headers.has('Authorization');

    const authReq =
        token && !isPublic(req.url) && !alreadyHasAuth
            ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
            : req;

    return next(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401 && !isPublic(req.url)) {
                const refreshToken = localStorage.getItem('rohnamo_refresh_token');
                if (refreshToken) {
                    // Инжектим AuthService только здесь — не при создании
                    const authService = inject(AuthService);
                    return authService.refreshToken().pipe(
                        switchMap(() => {
                            const newToken = localStorage.getItem('rohnamo_access_token');
                            const retried = req.clone({
                                setHeaders: { Authorization: `Bearer ${newToken}` },
                            });
                            return next(retried);
                        }),
                        catchError((refreshErr) => {
                            localStorage.removeItem('rohnamo_access_token');
                            localStorage.removeItem('rohnamo_refresh_token');
                            router.navigate(['/auth/login']);
                            return throwError(() => refreshErr);
                        }),
                    );
                }
                localStorage.removeItem('rohnamo_access_token');
                localStorage.removeItem('rohnamo_refresh_token');
                router.navigate(['/auth/login']);
            }
            return throwError(() => err);
        }),
    );
};
