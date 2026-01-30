import { HttpInterceptorFn } from '@angular/common/http';
import { TokenStorage } from '../services/token-storage';
import { inject} from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorage);
  const token = tokenStorage.getToken();
  
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }
 
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token).set('Content-Type', 'application/json'),
    });
    return next(authReq);
  }
  
  return next(req);
};
