import { Routes } from '@angular/router';
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
  },
  {
    path: 'profile',
    component: ProfilePage,
  },
  {
    path: 'profile/history',
    component: ProfileHistoryPage,
  },
  {
    path: 'translate/:phraseSetId',
    component: TranslatePage,
  },
  {
    path: 'translate/:phraseSetId/end',
    component: TranslationEndPage,
  },
  {
    path: 'set-entries/:id',
    component: TransEntryPage,
  },
];
