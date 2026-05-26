import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-translation-end-page',
  imports: [RouterLink, ZardButtonComponent],
  templateUrl: './translation-end.page.html',
  styleUrl: './translation-end.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationEndPage {
  protected readonly currentPhraseSetId = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
}
