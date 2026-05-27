export interface PhraseSet {
  id: string;
  title: string;
  description: string;
  language: string;
  published: boolean;
  createdAt: string;
  publishedAt: string | null;
  phraseCount: number;
}
