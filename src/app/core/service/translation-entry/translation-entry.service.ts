import { API } from '@/core/config/api-uris.config';
import { Phrase } from '@/core/types/phrase.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, map, switchMap } from 'rxjs';

import {
  TranslatedPhrase,
  TranslationEntrySubmitRequest,
} from '@/core/types/translation-entry.type';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationEntryService {
  private readonly submitApi = API.TRANSLATION_ENTRIES.SUBMIT;
  private readonly nextPhraseInSetApi = API.TRANSLATION_ENTRIES.NEXT_PHRASE_IN_SET;
  private readonly nextPhraseSetApi = API.TRANSLATION_ENTRIES.NEXT_PHRASE_SET;
  private readonly entriesByPhraseSetIdApi = API.TRANSLATION_ENTRIES.GET_BY_ID;

  private readonly authenticationService = inject(AuthenticationService);
  private readonly client = inject(HttpClient);

  findEntriesByPhraseSetId(id: string) {
    return this.client.get<{ entries: TranslatedPhrase[] }>(this.entriesByPhraseSetIdApi(id));
  }

  getNextPhraseInPhraseSet(phraseSetId: string) {
    return this.client.get<{ phrase: Phrase; state: 'finished' | 'in-progress' }>(
      this.nextPhraseInSetApi(phraseSetId),
    );
  }

  submit(data: TranslationEntrySubmitRequest, audio: File) {
    return from(this.authenticationService.getUserId()).pipe(
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

  getNextPhraseSet() {
    return this.client.get<{ phraseSet: string; state: 'finished' | 'in-progress' }>(
      this.nextPhraseSetApi,
    );
  }
}
