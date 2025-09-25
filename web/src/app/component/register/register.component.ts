import { Component } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {UserService} from '../../domain/user/user.service';
import {Router, RouterLink} from '@angular/router';
import {RegisterUserRequest} from '../../domain/user/model/register-user-request';
import {AlertService, AuthService, TmBootstrapModule} from '@tommeijer/tm-bootstrap';
import {PasswordStrengthMeterComponent} from "@wise-community/angular-password-strength-meter";
import {RepeatedPasswordValidatorDirective} from "../../validator/repeated-password-validator.directive";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule,
    TmBootstrapModule,
    PasswordStrengthMeterComponent,
    RepeatedPasswordValidatorDirective,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public request: RegisterUserRequest = {};
  public repeatPassword: string;
  public wasValidated = false;
  public isSubmitting = false;

  constructor(private readonly userService: UserService,
              private readonly alertService: AlertService,
              private readonly authService: AuthService,
              private readonly router: Router) {
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
