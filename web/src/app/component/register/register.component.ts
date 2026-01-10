import {Component, inject, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {UserService} from '../../domain/user/user.service';
import {Router, RouterLink} from '@angular/router';
import {RegisterUserRequest} from '../../domain/user/model/register-user-request';
import {AlertService, AuthService, TmBootstrapModule} from '@tommeijer/tm-bootstrap';
import {PasswordStrengthMeterComponent} from "@wise-community/angular-password-strength-meter";
import {RepeatedPasswordValidatorDirective} from "../../validator/repeated-password-validator.directive";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule,
    TmBootstrapModule,
    PasswordStrengthMeterComponent,
    RepeatedPasswordValidatorDirective,
    RouterLink
  ],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public request: RegisterUserRequest = {};
  public repeatPassword: string;
  public wasValidated = signal(false);
  public isSubmitting = signal(false);

  public register(form: NgForm): void {
    this.wasValidated.set(!form.valid);
    if (!form.valid || this.isSubmitting()) {
      return;
    }
    this.isSubmitting.set(true);
    this.userService.register(this.request).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.alertService.clear();
        this.authService.saveAuth(response.accessToken, response.refreshToken, true);
        this.router.navigateByUrl('/home');
      },
      error: () => this.isSubmitting.set(false)
    });
  }
}
