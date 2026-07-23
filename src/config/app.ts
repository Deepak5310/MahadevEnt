/**
 * app.ts — Centralized application configuration.
 *
 * All environment variables are consumed here and re-exported as typed
 * constants. Components and services import from this file, never from
 * `import.meta.env` directly — this keeps env usage auditable in one place.
 */

export const APP_CONFIG = {
  /** Human-readable application name. */
  name: import.meta.env.VITE_APP_NAME ?? 'Mahadev Enterprise',

  /** Semantic version of the application. */
  version: '1.0.0',

  /**
   * Base URL for API requests.
   * Empty string means localStorage mock mode is active.
   */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',

  /** True when running under `npm run dev`. */
  isDev: import.meta.env.DEV,

  /** True when running a production build. */
  isProd: import.meta.env.PROD,

  /** Vite's MODE string: 'development' | 'production' | 'test'. */
  environment: import.meta.env.MODE,

  /**
   * True when no API base URL is configured.
   * Services use this flag to switch between mock and real data.
   */
  get isMockMode() {
    return !this.apiBaseUrl
  },
} as const
