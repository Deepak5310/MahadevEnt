/**
 * types/index.ts — Global shared TypeScript types.
 *
 * Rules:
 * - Only truly cross-cutting types live here.
 * - Module-specific types (e.g., Attendance, Employee) live inside their module.
 * - Use `type` keyword, not `interface`, for union/intersection types.
 * - Avoid `enum`; use `as const` union types instead (TS6 erasableSyntaxOnly).
 */

// ── Roles ────────────────────────────────────────────────────

/** All possible user roles in the system. */
export type Role = 'admin' | 'employee'

// ── User ─────────────────────────────────────────────────────

/** Authenticated user stored in auth session. */
export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
  department?: string
  designation?: string
}

// ── API Response Wrappers ─────────────────────────────────────

/** Standard paginated list response from the API. */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** Standard single-resource API response. */
export interface ApiResponse<T> {
  data: T
  message?: string
}

/** Standard API error shape. */
export interface ApiError {
  message: string
  code?: string
  statusCode: number
  details?: Record<string, string[]>
}

// ── Utility Types ─────────────────────────────────────────────

/** Makes specified keys required on a type. */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/** ID-only partial — useful for update payloads. */
export type WithId<T> = T & { id: string }

/** Record status used across multiple modules. */
export type Status = 'active' | 'inactive' | 'pending'
