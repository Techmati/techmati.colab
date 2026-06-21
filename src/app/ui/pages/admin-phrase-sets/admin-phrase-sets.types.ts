export type AdminPhraseSetStatus = 'published' | 'draft';

export interface AdminPhraseSetPreview {
  readonly id: string;
  readonly title: string;
  readonly phraseCount: number;
  readonly updatedLabel: string;
  readonly status: AdminPhraseSetStatus;
}
