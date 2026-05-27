export interface Phrase {
  id: string;
  phraseSetId: string;
  sourceText: string;
  context: string;
  position: number;
  language: 'nahuatl_to_spanish' | 'spanish_to_nahuatl';
  createdAt: string;
  updatedAt: string;
}
