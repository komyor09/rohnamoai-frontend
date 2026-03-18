import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserIdentityService } from '../services/user-identity.service';

export const userUuidInterceptor: HttpInterceptorFn = (req, next) => {
  const identity = inject(UserIdentityService);
  const cloned = req.clone({
    setHeaders: { 'X-User-UUID': identity.uuid }
  });
  return next(cloned);
};
