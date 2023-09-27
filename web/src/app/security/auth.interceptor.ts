import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import {AuthService} from './auth.service';

const REFRESH_ENDPOINT = '/auth/refresh-access-token';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  public constructor(private authService: AuthService) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = new URL(req.url);
    if (url.pathname !== REFRESH_ENDPOINT && this.authService.isAuthenticated()) {
      let accessToken = this.authService.getAccessToken();
      if (this.authService.isTokenExpired(accessToken)) {
        return this.authService.refreshAccessToken().pipe(
          switchMap(response => {
            this.authService.saveAccessToken(response.accessToken);
            req = this.setAuthorization(req, response.accessToken);
            return next.handle(req);
          })
        );
      }
      req = this.setAuthorization(req, accessToken);
    }
    return next.handle(req);
  }

  private setAuthorization(req: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return req.clone({headers: req.headers.set('Authorization', 'Bearer ' + accessToken)});
  }
}
