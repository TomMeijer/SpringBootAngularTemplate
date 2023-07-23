import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {AuthResponse} from './auth-response';
import {UserService} from '../domain/user/user.service';

const TOKEN_KEY = 'auth-token';

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

  public refreshToken(): void {
    this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh-token`, {}).subscribe(response => {
      this.saveAuth(response.token, !!localStorage.getItem(TOKEN_KEY));
    });
  }

  public logout(): void {
    this.clearStorage();
    this.userService.clear();
    this.router.navigateByUrl('/login');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtService.isTokenExpired(token);
  }

  public saveAuth(token: string, remember: boolean): void {
    this.clearStorage();
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  }

  public getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? token : sessionStorage.getItem(TOKEN_KEY);
  }

  private clearStorage(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
}
