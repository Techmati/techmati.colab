import { API } from '@/core/config/api-uris.config';
import { Phrase } from '@/core/types/phrase.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';

import {
  TranslatedPhrase,
  TranslationEntrySubmitRequest,
} from '@/core/types/translation-entry.type';
import { ContributorService } from '../contributor/contributor.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationEntryService {
  private readonly submitApi = API.TRANSLATION_ENTRIES.SUBMIT;
  private readonly nextPhraseInSetApi = API.TRANSLATION_ENTRIES.NEXT_PHRASE_IN_SET;
  private readonly nextPhraseSetApi = API.TRANSLATION_ENTRIES.NEXT_PHRASE_SET;
  private readonly entriesByPhraseSetIdApi = API.TRANSLATION_ENTRIES.GET_BY_ID;

  private readonly contributorService = inject(ContributorService);
  private readonly client = inject(HttpClient);

  findEntriesByPhraseSetId(id: string) {
    return this.contributorService.getProfile().pipe(
      map((profile) => profile.id),
      switchMap((contributorId) =>
        this.client.get<{ entries: TranslatedPhrase[] }>(
          this.entriesByPhraseSetIdApi(contributorId, id),
        ),
      ),
    );
  }

  getNextPhraseInPhraseSet(phraseSetId: string) {
    return this.contributorService.getProfile().pipe(
      map((profile) => profile.id),
      switchMap((contributorId) =>
        this.client.get<{ phrase: Phrase; state: 'finished' | 'in-progress' }>(
          this.nextPhraseInSetApi(contributorId, phraseSetId),
        ),
      ),
    );
  }

  submit(data: TranslationEntrySubmitRequest, audio: File) {
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
          this.nextPhraseSetApi(contributorId),
        ),
      ),
    );
  }
}
