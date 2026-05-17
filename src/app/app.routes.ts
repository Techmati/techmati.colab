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
  {
    path: 'profile',
    loadComponent: () => import('./ui/pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'profile/history',
    loadComponent: () => import('./ui/pages/profile-history/profile-history.page').then((m) => m.ProfileHistoryPage),
  },
];
