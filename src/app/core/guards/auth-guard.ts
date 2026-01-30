import { CanActivateFn,Router } from '@angular/router';
import { TokenStorage } from '../services/token-storage';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
const tokenStorage = inject(TokenStorage);
const router = inject(Router);
if (tokenStorage.isLoggedIn()) {
    return true;
  }
    router.navigate(['/login']);
  return false;
};

