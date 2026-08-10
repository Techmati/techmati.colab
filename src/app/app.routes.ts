import { Routes } from '@angular/router';
import { authenticationGuard } from './core/guard/authentication.guard';
import { ContributorsPage } from './ui/pages/contributors/contributors.page';
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
    title: 'Bienvenido - Techmati Colab',
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./ui/pages/guest-signup/guest-signup.page').then(
        (module) => module.GuestSignupPage,
      ),
    title: 'Crear cuenta - Techmati Colab',
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authenticationGuard],
    title: 'Inicio - Techmati Colab',
  },
  {
    path: 'contributors',
    component: ContributorsPage,
    canActivate: [authenticationGuard],
    title: 'Contribuidores - Techmati Colab',
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./ui/pages/admin-dashboard/admin-dashboard.page').then(
        (module) => module.AdminDashboardPage,
      ),
    canActivate: [authenticationGuard],
    title: 'Administrador - Techmati Colab',
  },
  {
    path: 'admin/phrase-sets',
    loadComponent: () =>
      import('./ui/pages/admin-phrase-sets/admin-phrase-sets.page').then(
        (module) => module.AdminPhraseSetsPage,
      ),
    canActivate: [authenticationGuard],
    title: 'Set de Frases - Techmati Colab',
  },
  {
    path: 'admin/phrase-sets/:phraseSetId/translations',
    loadComponent: () =>
      import('./ui/pages/admin-translation-detail/admin-translation-detail.page').then(
        (module) => module.AdminTranslationDetailPage,
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: 'admin/translations/:translationId/contributors/:contributorId',
    loadComponent: () =>
      import('./ui/pages/admin-translation-user-contributions/admin-translation-user-contributions.page').then(
        (module) => module.AdminTranslationUserContributionsPage,
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: 'admin/translations',
    loadComponent: () =>
      import('./ui/pages/admin-translations/admin-translations.page').then(
        (module) => module.AdminTranslationsPage,
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: 'admin/contributors/:contributorId/contributions',
    loadComponent: () =>
      import('./ui/pages/admin-user-contributions/admin-user-contributions.page').then(
        (module) => module.AdminUserContributionsPage,
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./ui/pages/admin-users/admin-users.page').then((module) => module.AdminUsersPage),
    canActivate: [authenticationGuard],
  },
  {
    path: 'admin/users/:userId',
    loadComponent: () =>
      import('./ui/pages/admin-user-detail/admin-user-detail.page').then(
        (module) => module.AdminUserDetailPage,
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: 'admin/phrase-sets/:phraseSetId',
    loadComponent: () =>
      import('./ui/pages/admin-phrase-set-editor/admin-phrase-set-editor.page').then(
        (module) => module.AdminPhraseSetEditorPage,
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
    path: 'translate/:translationId',
    component: TranslatePage,
    canActivate: [authenticationGuard],
  },
  {
    path: 'translate/:translationId/end',
    component: TranslationEndPage,
    canActivate: [authenticationGuard],
  },
  {
    path: 'translation/:translationId',
    component: TransEntryPage,
    canActivate: [authenticationGuard],
  },
];
