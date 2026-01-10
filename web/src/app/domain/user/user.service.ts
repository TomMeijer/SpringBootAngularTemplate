import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from './model/user';
import {UpdateUserRequest} from './model/update-user-request';
import {environment} from '../../../environments/environment';
import {RegisterUserRequest} from './model/register-user-request';
import {RegisterUserResponse} from './model/register-user-response';
import {Router} from '@angular/router';
import {AuthService} from '@tommeijer/tm-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly user = signal<User>(null);

  public update(request: UpdateUserRequest): Observable<void> {
    const formData = new FormData();
    Object.keys(request)
      .filter(key => request[key] !== undefined && request[key] !== null)
      .forEach(key => formData.append(key, request[key]));
    return this.http.put<void>(`${environment.apiUrl}/user`, formData);
  }

  public get(): void {
    this.http.get<User>(`${environment.apiUrl}/user`)
      .subscribe(user => this.user.set(user));
  }

  public register(request: RegisterUserRequest): Observable<RegisterUserResponse> {
    return this.http.post<RegisterUserResponse>(`${environment.apiUrl}/user`, request);
  }

  public delete(): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/user`);
  }

  public logout(): void {
    this.authService.clearAuth();
    this.user.set(null);
    this.router.navigateByUrl('/login');
  }
}
