import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../security/auth.service';
import {Router} from '@angular/router';
import {AlertService} from '@tommeijer/tm-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public email: string;
  public password: string;
  public rememberMe = true;

  public wasValidated = false;
  public isSubmitting = false;

  constructor(private authService: AuthService,
              private alertService: AlertService,
              private router: Router) {
  }

  public login(form: NgForm): void {
    this.wasValidated = !form.valid;
    if (!form.valid || this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.authService.login(this.email, this.password).subscribe(
      response => {
        this.isSubmitting = false;
        this.alertService.clear();
        this.authService.saveAuth(response.accessToken, response.refreshToken, this.rememberMe);
        this.router.navigateByUrl('/home');
      },
      () => this.isSubmitting = false
    );
  }
}
