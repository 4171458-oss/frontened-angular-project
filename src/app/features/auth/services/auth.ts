import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { ApiClient } from '../../../core/services/api-client';
import { TokenStorage } from '../../../core/services/token-storage';

import { AuthResponse, LoginRequest, RegisterRequest } from '../../../shared/models/api-response.model';
import { User } from '../../../shared/models/user.model';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly loginPath = 'auth/login';
  private readonly registerPath = 'auth/register';
  
  private readonly api = inject(ApiClient);
  private readonly tokenStorage = inject(TokenStorage);

  readonly currentUser = signal<User | null>(null);

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(this.loginPath, credentials).pipe(
      tap((res) => {
     
        this.tokenStorage.setToken(res.token);
      })
    );
  }


  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(this.registerPath, payload).pipe(
      tap((res) => {
        this.tokenStorage.setToken(res.token);
      })
    );
  }

  getUser(): Observable<User> {
    return this.api.get<User>('auth/me').pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  logout(): void {
    this.tokenStorage.logout();
    this.currentUser.set(null);
  }


  isAuthenticated(): boolean {
    return !!this.tokenStorage.getToken();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }
}