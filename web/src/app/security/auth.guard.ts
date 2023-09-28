import {Injectable} from '@angular/core';
import {CanActivateChild} from '@angular/router';
import {UserService} from '../domain/user/user.service';
import {AuthService} from '@tommeijer/tm-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

  public constructor(private authService: AuthService,
                     private userService: UserService) { }

  public canActivateChild(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.userService.logout();
      return false;
    }
    return true;
  }
}
