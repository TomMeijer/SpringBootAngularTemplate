import {Component, inject, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AlertService, AuthService, TmBootstrapModule} from '@tommeijer/tm-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    TmBootstrapModule,
    RouterLink
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  public email: string;
  public password: string;
  public rememberMe = true;
  public wasValidated = signal(false);
  public isSubmitting = signal(false);

  public login(form: NgForm): void {
    this.wasValidated.set(!form.valid);
    if (!form.valid || this.isSubmitting()) {
      return;
    }
    this.isSubmitting.set(true);
    this.authService.login(this.email, this.password).subscribe({
      next: response => {
        this.isSubmitting.set(false);
        this.alertService.clear();
        this.authService.saveAuth(response.accessToken, response.refreshToken, this.rememberMe);
        this.router.navigateByUrl('/home');
      },
      error: () => this.isSubmitting.set(false)
    });
  }
}
