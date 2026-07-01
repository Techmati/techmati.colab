const BASE_URL =
  import.meta.env['NG_APP_ENV'] === 'production'
    ? import.meta.env['NG_APP_PROD_API_URL']
    : 'http://localhost:54321/functions/v1/techmati-api';

const API = {
  BASE_URL,
  PROFILE: {
    GET: `${BASE_URL}/profile`,
  },
  PHRASE_SETS: {
    PAGINATED: `${BASE_URL}/phrase-sets`,
  },
  TRANSLATION_ENTRIES: {
    NEXT_PHRASE_IN_SET: (phraseSetId: string) =>
      `${BASE_URL}/translation-entries/phrase-set/${phraseSetId}/next`,
    NEXT_PHRASE_SET: `${BASE_URL}/translation-entries/next-set`,
    SUBMIT: `${BASE_URL}/translation-entries`,
    GET_BY_ID: (entryId: string) => `${BASE_URL}/translation-entries/phrase-set/${entryId}`,
  },
  SUMMARY: {
    FILTERED: `${BASE_URL}/summary`,
    PHRASE_SET: (phraseSetId: string) => `${BASE_URL}/summary/phrase-set/${phraseSetId}`,
    STATS: `${BASE_URL}/summary/stats`,
  },
  ADMIN: {
    STATS: {
      SUMMARY: `${BASE_URL}/admin/stats/summary/today`,
      USER: (userId: string) => `${BASE_URL}/admin/stats/user/${userId}`,
      CONTRIBUTIONS: {
        LATEST: `${BASE_URL}/admin/stats/contributions/latest`,
      },
      USERS: {
        LATEST: `${BASE_URL}/admin/stats/users/latest`,
      },
    },
    PHRASE_SET: {
      SEARCH: `${BASE_URL}/admin/phrase-sets`,
      BY_ID: (phraseSetId: string) => `${BASE_URL}/admin/phrase-sets/${phraseSetId}`,
      PHRASES: (phraseSetId: string) => `${BASE_URL}/admin/phrase-sets/${phraseSetId}/phrases`,
    },
    USERS: {
      BY_ID: (userId: string) => `${BASE_URL}/admin/users/${userId}`,
      SEARCH: `${BASE_URL}/admin/users`,
      BAN: (userId: string) => `${BASE_URL}/admin/users/${userId}/ban`,
      UNBAN: (userId: string) => `${BASE_URL}/admin/users/${userId}/unban`,
      ASSIGN_ROLE: (userId: string) => `${BASE_URL}/admin/users/${userId}/role`,
    },
    SUMMARIES: (userId: string) => `${BASE_URL}/admin/summaries/users/${userId}`,
  },
};

export { API };
