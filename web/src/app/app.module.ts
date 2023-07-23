import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterOutlet} from '@angular/router';
import {UnauthenticatedComponent} from './layouts/unauthenticated/unauthenticated.component';
import {AuthenticatedComponent} from './layouts/authenticated/authenticated.component';
import {AppRoutingModule} from './app-routing.module';
import { NavbarComponent } from './component/navbar/navbar.component';
import { FooterComponent } from './component/footer/footer.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './domain/home/home.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {TmBootstrapModule} from '@tommeijer/tm-bootstrap/src/lib/tm-bootstrap.module';
import {AuthInterceptor} from './security/auth.interceptor';
import {ErrorInterceptor} from './error/error.interceptor';
import { AlertOutputComponent } from './alert/alert-output/alert-output.component';
import {AlertModule} from 'ngx-bootstrap/alert';
import {PasswordStrengthMeterModule} from 'angular-password-strength-meter';
import {RepeatedPasswordValidatorDirective} from './validator/repeated-password-validator.directive';
import { ProfileComponent } from './domain/user/component/profile/profile.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PopoverModule} from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [
    AppComponent,
    UnauthenticatedComponent,
    AuthenticatedComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AlertOutputComponent,
    RepeatedPasswordValidatorDirective,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TmBootstrapModule,
    AlertModule,
    PasswordStrengthMeterModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
