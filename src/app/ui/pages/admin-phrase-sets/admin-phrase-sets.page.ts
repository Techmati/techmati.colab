import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { AdminPhraseSetPreview } from './admin-phrase-sets.types';
import { AdminPhraseSetsBottomNav } from './ui/organisms/admin-phrase-sets-bottom-nav/admin-phrase-sets-bottom-nav';
import { AdminPhraseSetsListPanel } from './ui/organisms/admin-phrase-sets-list-panel/admin-phrase-sets-list-panel';
import { AdminPhraseSetsToolbar } from './ui/organisms/admin-phrase-sets-toolbar/admin-phrase-sets-toolbar';
import { AdminPhraseSetsTopBar } from './ui/organisms/admin-phrase-sets-top-bar/admin-phrase-sets-top-bar';

@Component({
  selector: 'tm-admin-phrase-sets-page',
  imports: [
    AdminPhraseSetsTopBar,
    AdminPhraseSetsToolbar,
    AdminPhraseSetsListPanel,
    AdminPhraseSetsBottomNav,
  ],
  templateUrl: './admin-phrase-sets.page.html',
  styleUrl: './admin-phrase-sets.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsPage {
  readonly searchParam = input.required<string>();
  protected readonly phraseSets: readonly AdminPhraseSetPreview[] = [
    {
      id: 'vocabulario-medico-basico',
      title: 'Vocabulario Médico Básico',
      phraseCount: 15,
      updatedLabel: 'Actualizado hace 2 días',
      status: 'published',
    },
    {
      id: 'sintomas-comunes',
      title: 'Síntomas Comunes',
      phraseCount: 24,
      updatedLabel: 'Actualizado ayer',
      status: 'published',
    },
    {
      id: 'partes-del-cuerpo',
      title: 'Partes del Cuerpo',
      phraseCount: 8,
      updatedLabel: 'Actualizado hace 1 hora',
      status: 'draft',
    },
    {
      id: 'emergencias-cardiacas',
      title: 'Emergencias Cardíacas',
      phraseCount: 12,
      updatedLabel: 'Actualizado hace 1 semana',
      status: 'published',
    },
    {
      id: 'protocolo-covid-19',
      title: 'Protocolo COVID-19',
      phraseCount: 30,
      updatedLabel: 'Actualizado hace 4 días',
      status: 'draft',
    },
  ];

  protected readonly totalResults = 124;
}
