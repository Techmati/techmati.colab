import { createClient } from '@supabase/supabase-js';

const projectUrl =
  import.meta.env['NG_APP_ENV'] === 'production'
    ? import.meta.env['NG_APP_PROD_SUPABASE_URL']
    : 'http://localhost:54321';
const projectAnonKey =
  import.meta.env['NG_APP_ENV'] === 'production'
    ? import.meta.env['NG_APP_PROD_SUPABASE_ANON_KEY']
    : 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';
export const supabaseClient = createClient(projectUrl, projectAnonKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    persistSession: true,
  },
});
