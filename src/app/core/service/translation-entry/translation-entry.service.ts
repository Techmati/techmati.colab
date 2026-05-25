import { API } from '@/core/config/api-uris.config';
import { Phrase } from '@/core/types/phrase.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';

import { TranslationEntry } from '@/core/types/translation-entry.type';
import { ContributorService } from '../contributor/contributor.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationEntryService {
  private readonly submitApi = API.TRANSLATION_ENTRIES.SUBMIT;

  private readonly contributorService = inject(ContributorService);
  private readonly client = inject(HttpClient);

  getNextPhraseInPhraseSet(phraseSetId: string) {
    return this.contributorService.getProfile(this.contributorService.sessionId()).pipe(
      map((profile) => profile.id),
      switchMap((contributorId) =>
        this.client.get<{ phrase: Phrase }>(
          API.TRANSLATION_ENTRIES.NEXT_PHRASE_IN_SET(contributorId, phraseSetId),
        ),
      ),
      map((response) => response.phrase),
    );
  }

  submit(entry: TranslationEntry, audio: File) {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(entry)], { type: 'application/json' }));
    formData.append('audio', audio);

    return this.client.post(this.submitApi, formData);
  }
}
