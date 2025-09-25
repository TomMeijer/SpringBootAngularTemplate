import {Routes} from '@angular/router';
import {UnauthenticatedComponent} from './layouts/unauthenticated/unauthenticated.component';
import {AuthenticatedComponent} from './layouts/authenticated/authenticated.component';
import {AuthGuard} from './security/auth.guard';
import {LoginComponent} from './component/login/login.component';
import {RegisterComponent} from './component/register/register.component';
import {HomeComponent} from './domain/home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: UnauthenticatedComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
    ]
  },
  {
    path: '',
    component: AuthenticatedComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      }
    ]
  }
];
