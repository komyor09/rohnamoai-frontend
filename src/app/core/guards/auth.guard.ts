import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const ACCESS_TOKEN_KEY = 'rohnamo_access_token';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    // Проверяем токен напрямую из localStorage — синхронно и надёжно
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
        return true;
    }
    return router.createUrlTree(['/auth/login']);
};

export const guestGuard: CanActivateFn = () => {
    const router = inject(Router);
    // Если токен есть — уже залогинен, редирект на home
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
        return true;
    }
    return router.createUrlTree(['/pages/home']);
};
