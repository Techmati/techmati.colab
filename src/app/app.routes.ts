import { Routes } from '@angular/router';
import { authenticationGuard } from './core/guard/authentication.guard';
import { DashboardPage } from './ui/pages/dashboard/dashboard.page';
import { ProfileHistoryPage } from './ui/pages/profile-history/profile-history.page';
import { ProfilePage } from './ui/pages/profile/profile.page';
import { TransEntryPage } from './ui/pages/trans-entry/trans-entry.page';
import { TranslatePage } from './ui/pages/translate/translate.page';
import { TranslationEndPage } from './ui/pages/translation-end/translation-end.page';
import { WelcomePage } from './ui/pages/welcome/welcome.page';

export const routes: Routes = [
  {
    path: '',
    component: WelcomePage,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authenticationGuard],
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./ui/pages/admin-dashboard/admin-dashboard.page').then(
        (module) => module.AdminDashboardPage,
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: 'admin/phrase-sets',
    loadComponent: () =>
      import('./ui/pages/admin-phrase-sets/admin-phrase-sets.page').then(
        (module) => module.AdminPhraseSetsPage,
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [authenticationGuard],
  },
  {
    path: 'profile/history',
    component: ProfileHistoryPage,
    canActivate: [authenticationGuard],
  },
  {
    path: 'translate/:phraseSetId',
    component: TranslatePage,
    canActivate: [authenticationGuard],
  },
  {
    path: 'translate/:phraseSetId/end',
    component: TranslationEndPage,
    canActivate: [authenticationGuard],
  },
  {
    path: 'set-entries/:id',
    component: TransEntryPage,
    canActivate: [authenticationGuard],
  },
];
