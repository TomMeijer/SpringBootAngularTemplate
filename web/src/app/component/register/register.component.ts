import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../../domain/user/user.service';
import {Router} from '@angular/router';
import {RegisterUserRequest} from '../../domain/user/model/register-user-request';
import {AlertService, AuthService} from '@tommeijer/tm-bootstrap';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public request: RegisterUserRequest = {};
  public repeatPassword: string;
  public wasValidated = false;
  public isSubmitting = false;

  constructor(private userService: UserService,
              private alertService: AlertService,
              private authService: AuthService,
              private router: Router) {
  }

  public register(form: NgForm): void {
    this.wasValidated = !form.valid;
    if (!form.valid || this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.userService.register(this.request).subscribe(
      (response) => {
        this.isSubmitting = false;
        this.alertService.clear();
        this.authService.saveAuth(response.accessToken, response.refreshToken, true);
        this.router.navigateByUrl('/home');
      },
      () => this.isSubmitting = false
    );
  }
}
