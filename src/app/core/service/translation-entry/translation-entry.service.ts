import { API } from '@/core/config/api-uris.config';
import { Phrase } from '@/core/types/phrase.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';

import { PhraseSetsInProgress } from '@/core/types/contributor-summary-response.type';
import { TranslationEntry } from '@/core/types/translation-entry.type';
import { ContributorService } from '../contributor/contributor.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationEntryService {
  private readonly submitApi = API.TRANSLATION_ENTRIES.SUBMIT;

  private readonly contributorService = inject(ContributorService);
  private readonly client = inject(HttpClient);

  getFiltered(
    page: number = 10,
    size: number = 1,
    filter: 'all' | 'incomplete' | 'completed' = 'all',
  ) {
    return this.contributorService.getProfile().pipe(
      map((profile) => profile.id),
      switchMap((contributorId) =>
        this.client.get<{ data: PhraseSetsInProgress[]; total: number }>(
          API.TRANSLATION_ENTRIES.FILTERED(contributorId),
          { params: { page, size, filter } },
        ),
      ),
    );
  }

  getNextPhraseInPhraseSet(phraseSetId: string) {
    return this.contributorService.getProfile().pipe(
      map((profile) => profile.id),
      switchMap((contributorId) =>
        this.client.get<{ phrase: Phrase; state: 'finished' | 'in-progress' }>(
          API.TRANSLATION_ENTRIES.NEXT_PHRASE_IN_SET(contributorId, phraseSetId),
        ),
      ),
    );
  }

  submit(data: Omit<TranslationEntry, 'contributorId'>, audio: File) {
    return this.contributorService.getProfile().pipe(
      map((profile) => profile.id),
      map((contributorId) => ({ ...data, contributorId })),
      map((entry) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify(entry));
        formData.append('audio', audio);
        return formData;
      }),
      switchMap((formData) => this.client.post(this.submitApi, formData)),
    );
  }

  //TODO: refactor to avoid multiple calls to getProfile if possible

  getNextPhraseSet() {
    return this.contributorService.getProfile().pipe(
      map((profile) => profile.id),
      switchMap((contributorId) =>
        this.client.get<{ phraseSet: string; state: 'finished' | 'in-progress' }>(
          API.TRANSLATION_ENTRIES.NEXT_PHRASE_SET(contributorId),
        ),
      ),
    );
  }

// getStats() {
//   return this.contributorService.getProfile().pipe(
//     map((profile) => profile.id),
//     switchMap((contributorId) =>
//       this.client.get<{ allTimeCount: number; weekCount: number; todayCount: number }>(
//         API.TRANSLATION_ENTRIES.STATS(contributorId),
//       ),
//     ),
//   );
// }
}
