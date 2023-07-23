import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AuthService} from '../security/auth.service';
import {AlertService} from '../alert/alert.service';

const DEFAULT_ERROR_MSG = 'Something went wrong. Please try again later or contact support.'

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  public constructor(private authService: AuthService,
                     private alertService: AlertService) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(response => {
        const msg = this.getErrorMsg(response);
        this.alertService.showDanger(msg);

        if (response.status === 403 || response.status === 401) {
          this.authService.logout();
        }
        return throwError(response);
      })
    );
  }

  private getErrorMsg(response: any): string {
    if (response.error) {
      const error = response.error;
      if (error.detail) {
        return error.detail;
      }
      if (error.message) {
        return error.message;
      }
    }
    return DEFAULT_ERROR_MSG;
  }
}
