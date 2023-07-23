import {Injectable} from '@angular/core';
import {CanActivateChild} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

  public constructor(private authService: AuthService) { }

  public canActivateChild(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
      return false;
    }
    return true;
  }

}
