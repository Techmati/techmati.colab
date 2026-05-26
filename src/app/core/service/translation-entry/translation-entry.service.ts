import { API } from '@/core/config/api-uris.config';
import { Phrase } from '@/core/types/phrase.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

import {
  ContributorSummaryResponse,
  PhraseSetsInProgress,
} from '@/core/types/contributor-summary-response.type';
import { TranslationEntry } from '@/core/types/translation-entry.type';
import { ContributorService } from '../contributor/contributor.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationEntryService {
  private readonly submitApi = API.TRANSLATION_ENTRIES.SUBMIT;

  private readonly contributorSummaryApi = API.TRANSLATION_ENTRIES.CONTRIBUTOR_SUMMARY;
  private readonly phraseSetSummaryApi = API.TRANSLATION_ENTRIES.PHRASE_SET_SUMMARY;

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

  getContributorSummary() {
    return this.contributorService.getProfile(this.contributorService.sessionId()).pipe(
      map((profile) => this.contributorSummaryApi(profile.id)),
      switchMap((uri) => this.client.get<ContributorSummaryResponse>(uri)),
    );
  }

  getPhraseSetSummary(phraseSetId: string): Observable<PhraseSetsInProgress> {
    return this.contributorService.getProfile(this.contributorService.sessionId()).pipe(
      map((profile) => profile.id),
      switchMap((contributorId) =>
        this.client.get<PhraseSetsInProgress>(this.phraseSetSummaryApi(contributorId, phraseSetId)),
      ),
    );
  }
}
