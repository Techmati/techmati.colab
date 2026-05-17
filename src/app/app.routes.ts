import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ui/pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
];
