import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import {
  authGuard,
  guestGuard,
  interviewerGuard,
} from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
    canActivate: [guestGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [interviewerGuard],
  },
  {
    path: 'join',
    loadComponent: () =>
      import('./features/join/join.component').then((m) => m.JoinComponent),
    canActivate: [authGuard],
  },
  {
    path: 'observe/:sessionId',
    loadComponent: () =>
      import('./features/observe/observe.component').then(
        (m) => m.ObserveComponent,
      ),
    canActivate: [interviewerGuard],
  },
  {
    path: 'problem/:id',
    loadComponent: () =>
      import('./features/problem/problem-page.component').then(
        (m) => m.ProblemPageComponent,
      ),
  },
  {
    path: 'problemset',
    loadComponent: () =>
      import('./features/problemset/problemset.component').then(
        (m) => m.ProblemsetComponent,
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then((m) => m.AboutComponent),
  },
];
