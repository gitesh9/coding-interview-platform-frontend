import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'problem/:id',
    loadComponent: () =>
      import('./features/problem/problem-page.component').then(
        m => m.ProblemPageComponent
      ),
  },
  {
    path: 'problemset',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: HomeComponent,
  },
];
