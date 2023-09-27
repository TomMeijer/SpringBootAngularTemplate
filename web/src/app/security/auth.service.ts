import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {AuthResponse} from './auth-response';
import {UserService} from '../domain/user/user.service';
import {RefreshAccessTokenResponse} from './refresh-access-token-response';

const ACCESS_TOKEN_KEY = 'tm-access-token';
const REFRESH_TOKEN_KEY = 'tm-refresh-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtService = new JwtHelperService();

  public constructor(private http: HttpClient,
                     private userService: UserService,
                     private router: Router) { }

  public login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth`, {email, password});
  }

  public refreshAccessToken(): Observable<RefreshAccessTokenResponse> {
    const request = {refreshToken: this.getStorageItem(REFRESH_TOKEN_KEY)}
    return this.http.post<RefreshAccessTokenResponse>(`${environment.apiUrl}/auth/refresh-access-token`, request);
  }

  public logout(): void {
    this.clearStorage();
    this.userService.clear();
    this.router.navigateByUrl('/login');
  }

  public isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return !!accessToken && (!this.jwtService.isTokenExpired(accessToken) || (!!refreshToken && !this.jwtService.isTokenExpired(refreshToken)));
  }

  public isTokenExpired(token: string): boolean {
    return this.jwtService.isTokenExpired(token);
  }

  public saveAuth(accessToken: string, refreshToken: string, remember: boolean): void {
    this.clearStorage();
    this.setStorageItem(ACCESS_TOKEN_KEY, accessToken, remember);
    this.setStorageItem(REFRESH_TOKEN_KEY, refreshToken, remember);
  }

  public saveAccessToken(accessToken: string): void {
    this.setStorageItem(ACCESS_TOKEN_KEY, accessToken, !!localStorage.getItem(ACCESS_TOKEN_KEY));
  }

  public getAccessToken(): string {
    return this.getStorageItem(ACCESS_TOKEN_KEY);
  }

  private getRefreshToken(): string {
    return this.getStorageItem(REFRESH_TOKEN_KEY);
  }

  private clearStorage(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  private getStorageItem(key: string): string {
    const value = localStorage.getItem(key);
    return value ? value : sessionStorage.getItem(key);
  }

  private setStorageItem(key: string, value: string, remember: boolean): void {
    if (remember) {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  }
}
