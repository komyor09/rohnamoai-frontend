import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserIdentityService } from '../services/user-identity.service';

export const userUuidInterceptor: HttpInterceptorFn = (req, next) => {
    const identity = inject(UserIdentityService);

    const uuid = identity.uuid();

    if (!uuid) {
        return next(req);
    }

    const cloned = req.clone({
        setHeaders: { 'X-User-UUID': uuid }
    });

    return next(cloned);
};
