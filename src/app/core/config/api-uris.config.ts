const BASE_URL =
  import.meta.env['NG_APP_ENV'] === 'production'
    ? import.meta.env['NG_APP_PROD_API_URL']
    : 'http:://localhost:54321/function/v1/techmati-api';

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
    NEXT_PHRASE_IN_SET: (contributorId: string, phraseSetId: string) =>
      `${BASE_URL}/translation-entries/contributor/${contributorId}/phrase-set/${phraseSetId}/next`,
    NEXT_PHRASE_SET: (contributorId: string) =>
      `${BASE_URL}/translation-entries/contributor/${contributorId}/next-set`,
    SUBMIT: `${BASE_URL}/translation-entries`,
    GET_BY_ID: (contributorId: string, entryId: string) =>
      `${BASE_URL}/translation-entries/contributor/${contributorId}/set-entries/${entryId}`,
  },
  SUMMARY: {
    FILTERED: `${BASE_URL}/summary`,
    PHRASE_SET: (contributorId: string, phraseSetId: string) =>
      `${BASE_URL}/summary/contributor/${contributorId}/phrase-set/${phraseSetId}`,
    STATS: (contributorId: string) => `${BASE_URL}/summary/contributor/${contributorId}/stats`,
  },
};

export { API };
