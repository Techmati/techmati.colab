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
    SUMMARY: (id: string) => `${BASE_URL}/phrase-sets/summary/${id}`,
  },
};

export { API };
