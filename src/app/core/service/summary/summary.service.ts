import { API } from '@/core/config/api-uris.config';
import { FullSummary } from '@/core/types/summary.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { ContributorService } from '../contributor/contributor.service';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private readonly client = inject(HttpClient);
  private readonly contributorService = inject(ContributorService);

  private phraseSummaryApi = API.SUMMARY.PHRASE_SET;

  getPhraseSumary(phraseId: string) {
    return this.contributorService.getProfile().pipe(
      map((contributor) => contributor.id),
      switchMap((contributorId) =>
        this.client.get<FullSummary | null>(this.phraseSummaryApi(contributorId, phraseId)),
      ),
    );
  }
}
