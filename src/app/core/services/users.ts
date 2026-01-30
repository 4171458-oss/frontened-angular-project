import { Injectable, inject } from '@angular/core';
import { ApiClient } from './api-client';
import { User } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly api = inject(ApiClient);

  getUsers(): Observable<User[]> {
    return this.api.get<User[]>('users');
  }
}
