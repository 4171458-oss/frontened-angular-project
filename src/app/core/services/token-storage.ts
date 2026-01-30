import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorage {
  static isLoggedIn(): import("@angular/router").MaybeAsync<import("@angular/router").GuardResult> {
    throw new Error('Method not implemented.');
  }
  private readonly TOKEN_KEY = 'auth-token';

  constructor() {}
  getToken(): string | null {
    return window.sessionStorage.getItem(this.TOKEN_KEY);
   
  }
  setToken(token: string): void {
    window.sessionStorage.removeItem(this.TOKEN_KEY);
    window.sessionStorage.setItem(this.TOKEN_KEY, token);
    
  }
  logout(): void {
    window.sessionStorage.clear();
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}

