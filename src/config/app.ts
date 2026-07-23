/**
 * app.ts — Centralized application configuration.
 *
 * All environment variables are consumed here.
 * Components and services import from this file — never from import.meta.env directly.
 */

export const APP_CONFIG = {
  name:             import.meta.env.VITE_APP_NAME    ?? 'Mahadev Enterprise',
  version:          '1.0.0',
  environment:      import.meta.env.MODE,
  isDev:            import.meta.env.DEV,
  isProd:           import.meta.env.PROD,

  // Supabase — required for auth + database
  supabaseUrl:      import.meta.env.VITE_SUPABASE_URL      ?? '',
  supabaseAnonKey:  import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
} as const
