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
    CONTRIBUTOR_SUMMARY: (contributorId: string) =>
      `${BASE_URL}/phrase-sets/summary/${contributorId}`,
    SUMMARY: (phraseSetId: string, contributorId: string) =>
      `${BASE_URL}/phrase-sets/summary/set/${phraseSetId}/contributor/${contributorId}`,
  },
  TRANSLATION_ENTRIES: {
    NEXT_PHRASE_IN_SET: (contributorId: string, phraseSetId: string) =>
      `${BASE_URL}/translation-entries/contributor/${contributorId}/phrase-set/${phraseSetId}/next`,
    SUBMIT: `${BASE_URL}/translation-entries`,
  },
};

export { API };
