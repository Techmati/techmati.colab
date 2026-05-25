export interface PhraseSet {
  id: string;
  title: string;
  description: string;
  language: string;
  published: boolean;
  created_at: string;
  published_at: string | null;
  phrasesCount: number;
}
