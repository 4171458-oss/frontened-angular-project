import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiClient {


  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options?: { headers?: HttpHeaders; params?: any }): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/${endpoint}`, options);
  }

  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/${endpoint}`, body, {
      headers,
    });
  }

  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}/${endpoint}`, body, {
      headers,
    });
  }

  patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(`${environment.apiUrl}/${endpoint}`, body, {
      headers,
    });
  }

  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}/${endpoint}`, {
      headers,
    });
  }
}
