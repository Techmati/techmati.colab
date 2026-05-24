const BASE_URL = 'http://localhost:54321/functions/v1/techmati-api';
const API = {
  BASE_URL,
  CONTRIBUTORS: {
    REGISTER: `${BASE_URL}/contributors/register`,
    LOGIN: `${BASE_URL}/contributors/login`,
  },
};

export { API };
