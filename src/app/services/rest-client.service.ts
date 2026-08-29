import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, startWith, Subject, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RestCache, RestCacheConfig } from '../interfaces/commons.interface';

@Injectable({
  providedIn: 'root'
})
export class RestClientService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = environment.API_URL;
  private cache = new Map<string, RestCache>();
  private getEvents = new Map<string, Subject<void>>();

  constructor() {}
  private request<R>(method: string, url: string, options: any, cacheConfig?: RestCacheConfig) {
    if (this.cache.has(url) && method === 'GET') {
      const cacheResponse = this.cache.get(url)!;
      if (cacheResponse.time + cacheResponse.expiredTime > Date.now()) {

          return new Observable<R>((observer) => {
            observer.next(cacheResponse.data as R);
            observer.complete();
          })
      } else {
        this.cache.delete(url);
      }
    }
    return this.http.request<R>(method, `${url.startsWith('http')? '':this.baseUrl}${url}`,
      {
        ...options,
        headers: {
          ...options?.headers,
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      }
    ).pipe(
      tap((response: any) => {
        if (method === 'GET' && response && cacheConfig) {
          const cacheResponse: RestCache = {
            time: Date.now(),
            expiredTime: cacheConfig.expiredTime,
            data: response,
          };
          this.cache.set(url, cacheResponse);
        }
      }),
      map((response: any) => response as R),
      catchError((err) => {
        if (err.status == 401) {
          this.router.navigate(['/login']);
      }
      return throwError(() => new Error("unauthorized access"));
      }));
  }

  updateGetter(url: string) {
    if (this.cache.has(url)) {
      this.cache.delete(url);
    }
    if (!this.getEvents.has(url)) {
      this.getEvents.set(url, new Subject<void>());
    }
    this.getEvents.get(url)!.next();
  }

  // Call on login/logout to prevent cross-user cache contamination
  clearCache() {
    this.cache.clear();
    this.getEvents.clear();
  }

  get<R>(url: string, options?: any, cacheConfig?: RestCacheConfig) {

    if (!this.getEvents.has(url)) {
      this.getEvents.set(url, new Subject<void>());
    }
    return this.getEvents.get(url)!.pipe(
      startWith(undefined),
      switchMap(() => this.request<R>('GET', url, options, cacheConfig))
    );
  }

  post<R>(url: string, body: any, options?: any) {
    return this.request<R>('POST', url, { body, ...options });
  }

  put<R>(url: string, body: any, options?: any) {
    return this.request<R>('PUT', `${this.baseUrl}${url}`, { body, ...options });
  }

  delete<R>(url: string, options?: any) {
    return this.request<R>('DELETE', `${this.baseUrl}${url}`, options);
  }
}
