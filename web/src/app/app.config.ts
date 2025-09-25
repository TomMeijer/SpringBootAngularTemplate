import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor, ErrorInterceptor} from '@tommeijer/tm-bootstrap';
import {environment} from '../environments/environment';
import {provideZxvbnServiceForPSM} from "@wise-community/angular-password-strength-meter/zxcvbn";
import {ModalModule} from "ngx-bootstrap/modal";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: 'apiUrl', useValue: environment.apiUrl},
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    provideZxvbnServiceForPSM(),
    importProvidersFrom(ModalModule.forRoot())
  ]
};
