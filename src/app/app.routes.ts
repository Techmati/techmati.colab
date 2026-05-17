import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ui/pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./ui/pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
];
