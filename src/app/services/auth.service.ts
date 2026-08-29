import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import {
  CheckTokenResponse,
  LoginResponse,
  RegisterResponse,
  User,
} from '../interfaces';
import { AuthStatus } from '../enums/auth-status.enum';
import { environment } from '../../environments/environment';
import { RestClientService } from './rest-client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private restClient = inject(RestClientService);
  constructor() {}
  private readonly baseUrl =  environment.API_URL;


  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Al mundo exterior
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  private setAuthentication(user: User, jwt: string): boolean {
    console.log({ user });

    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);

    console.log(this.authStatus());

    localStorage.setItem('jwt', jwt);

    return true;
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/log-in`;
    const body = { username, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, jwt }) => {
        this.restClient.clearCache(); // Clear previous user's cache before loading new session
        return this.setAuthentication(user, jwt);
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  register(
    name: string,
    email: string,
    username: string,
    password: string
  ): Observable<boolean> {
    const url = `${this.baseUrl}/auth/sign-up`;
    const body = { name, email, username, password };

    return this.http.post<RegisterResponse>(url, body).pipe(
      map(({ user, jwt }) => this.setAuthentication(user, jwt)),
      catchError((err) => {
        console.error('Register error:', err);
        return throwError(() => err?.error?.message || 'Error occurred during registration');
      })
    );
  }

  createCollaborator(
    name: string,
    email: string,
    username: string,
    password: string,
    projectId: string
  ): Observable<boolean> {
    const url = `${this.baseUrl}/auth/create-collaborator`;
    const body = { name, email, username, password, projectId };
    const jwt = localStorage.getItem('jwt');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwt}`);

    return this.http.post<any>(url, body, { headers }).pipe(
      map(() => true),
      catchError((err) => {
        console.error('Collaborator error:', err);
        return throwError(() => err?.error?.message || 'Error occurred during creation');
      })
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;

    if (typeof localStorage === 'undefined') {
      this.logout();
      return of(false);
    }

    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwt}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      tap((x) => console.log(x)),
      map(({ user, jwt }) => this.setAuthentication(user, jwt)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  logout() {
    if (typeof localStorage === 'undefined') {
      return;
    }

    this.restClient.clearCache(); // Wipe all cached responses on logout
    localStorage.clear();
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
