import {ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AuthInterceptor, ErrorInterceptor} from '@tommeijer/tm-bootstrap';
import {environment} from '../environments/environment';
import {provideZxvbnServiceForPSM} from "@wise-community/angular-password-strength-meter/zxcvbn";
import {ModalModule} from "ngx-bootstrap/modal";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    {provide: 'apiUrl', useValue: environment.apiUrl},
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor])),
    provideZxvbnServiceForPSM(),
    importProvidersFrom(ModalModule.forRoot())
  ]
};
