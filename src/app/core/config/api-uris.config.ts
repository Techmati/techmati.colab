const BASE_URL = 'http://localhost:54321/functions/v1/techmati-api';
const API = {
  BASE_URL,
  CONTRIBUTORS: {
    REGISTER: `${BASE_URL}/contributors/register`,
    LOGIN: `${BASE_URL}/contributors/login`,
    PROFILE: (id: string) => `${BASE_URL}/contributors/profile/${id}`,
  },
  PHRASE_SETS: {
    PAGINATED: `${BASE_URL}/phrase-sets`,
  },
  TRANSLATION_ENTRIES: {
    FILTERED: (contributorId: string) =>
      `${BASE_URL}/translation-entries/contributor/${contributorId}/summaries`,
    CONTRIBUTOR_SUMMARY: (contributorId: string) =>
      `${BASE_URL}/translation-entries/contributor/${contributorId}/summary`,
    NEXT_PHRASE_IN_SET: (contributorId: string, phraseSetId: string) =>
      `${BASE_URL}/translation-entries/contributor/${contributorId}/phrase-set/${phraseSetId}/next`,
    TODAY_COUNT: (contributorId: string) =>
      `${BASE_URL}/translation-entries/contributor/${contributorId}/today-count`,
    NEXT_PHRASE_SET: (contributorId: string) =>
      `${BASE_URL}/translation-entries/contributor/${contributorId}/next-set`,
    STATS: (contributorId: string) =>
      `${BASE_URL}/translation-entries/contributor/${contributorId}/stats`,
    SUBMIT: `${BASE_URL}/translation-entries`,
  },
  SUMMARY: {
    FILTERED: `${BASE_URL}/summary`,
    PHRASE_SET: (contributorId: string, phraseSetId: string) =>
      `${BASE_URL}/summary/contributor/${contributorId}/phrase-set/${phraseSetId}`,
    STATS: (contributorId: string) => `${BASE_URL}/summary/contributor/${contributorId}/stats`,
  },
};

export { API };
