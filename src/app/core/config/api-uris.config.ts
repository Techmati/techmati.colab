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
    BY_ID: (id: string) => `${BASE_URL}/phrase-sets/${id}`,
    PAGINATED: `${BASE_URL}/phrase-sets`,
    NEXT_PENDING: `${BASE_URL}/phrase-sets/next-pending`,
  },
  CONTRIBUTORS: {
    LIST: `${BASE_URL}/contributors`,
    BY_ID: (id: string) => `${BASE_URL}/contributors/${id}`,
    TRANSLATIONS: {
      LIST: (cId: string) => `${BASE_URL}/contributors/${cId}/translations`,
      STATS: (cId: string) => `${BASE_URL}/contributors/${cId}/translations/stats`,
      CREATE: (cId: string) => `${BASE_URL}/contributors/${cId}/translations`,
      DETAIL: (cId: string, tId: string) => `${BASE_URL}/contributors/${cId}/translations/${tId}`,
      DELETE: (cId: string, tId: string) => `${BASE_URL}/contributors/${cId}/translations/${tId}`,
      NEXT_PENDING: (cId: string, tId: string) =>
        `${BASE_URL}/contributors/${cId}/translations/${tId}/next-pending`,
      SUBMIT_ENTRY: (cId: string, tId: string) =>
        `${BASE_URL}/contributors/${cId}/translations/${tId}/entries`,
    },
  },
  LANGUAGE_FAMILIES: {
    LIST: `${BASE_URL}/language-families`,
    BY_ID: (id: string) => `${BASE_URL}/language-families/${id}`,
    GROUPS: (familyId: string) => `${BASE_URL}/language-families/${familyId}/groups`,
  },
  LANGUAGE_GROUPS: {
    BY_ID: (id: string) => `${BASE_URL}/language-groups/${id}`,
    VARIANTS: (groupId: string) => `${BASE_URL}/language-groups/${groupId}/variants`,
  },
  LANGUAGE_VARIANTS: {
    LIST: `${BASE_URL}/language-variants`,
    BY_ID: (id: string) => `${BASE_URL}/language-variants/${id}`,
  },
  ADMIN: {
    STATS: {
      OVERVIEW: `${BASE_URL}/admin/stats/overview`,
      LATEST_CONTRIBUTIONS: `${BASE_URL}/admin/stats/latest-contributions`,
      LATEST_USERS: `${BASE_URL}/admin/stats/latest-users`,
      CONTRIBUTOR_TRANSLATIONS: (cId: string) =>
        `${BASE_URL}/admin/stats/contributors/${cId}/translations`,
    },
    PHRASE_SET: {
      SEARCH: `${BASE_URL}/admin/phrase-sets`,
      BY_ID: (phraseSetId: string) => `${BASE_URL}/admin/phrase-sets/${phraseSetId}`,
      PHRASES: (phraseSetId: string) => `${BASE_URL}/admin/phrase-sets/${phraseSetId}/phrases`,
      TRANSLATIONS: (psId: string) => `${BASE_URL}/admin/phrase-sets/${psId}/translations`,
    },
    USERS: {
      BY_ID: (userId: string) => `${BASE_URL}/admin/users/${userId}`,
      SEARCH: `${BASE_URL}/admin/users`,
      BAN: (userId: string) => `${BASE_URL}/admin/users/${userId}/ban`,
      UNBAN: (userId: string) => `${BASE_URL}/admin/users/${userId}/unban`,
      ASSIGN_ROLE: (userId: string) => `${BASE_URL}/admin/users/${userId}/role`,
      AUTO_CONTRIBUTOR: (userId: string) => `${BASE_URL}/admin/users/${userId}/auto-contributor`,
    },
    CONTRIBUTORS: {
      TRANSLATIONS: (cId: string) => `${BASE_URL}/admin/contributors/${cId}/translations`,
      TRANSLATION_DETAIL: (cId: string, tId: string) =>
        `${BASE_URL}/admin/contributors/${cId}/translations/${tId}`,
    },
  },
};

export { API };
