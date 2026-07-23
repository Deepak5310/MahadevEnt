/**
 * database.types.ts — TypeScript types mirroring the Supabase database schema.
 *
 * Manually authored to match the SQL schema created in the Supabase dashboard.
 * Can be replaced with auto-generated types via:
 *   npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:          string
          full_name:   string
          email:       string
          role:        'admin' | 'employee'
          department:  string | null
          designation: string | null
          avatar_url:  string | null
          phone:       string | null
          is_active:   boolean
          created_at:  string
          updated_at:  string
        }
        Insert: {
          id:          string
          full_name:   string
          email:       string
          role?:       'admin' | 'employee'
          department?: string | null
          designation?: string | null
          avatar_url?: string | null
          phone?:      string | null
          is_active?:  boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?:         string
          full_name?:  string
          email?:      string
          role?:       'admin' | 'employee'
          department?: string | null
          designation?: string | null
          avatar_url?: string | null
          phone?:      string | null
          is_active?:  boolean
          updated_at?: string
        }
      }
    }
    Views:     Record<string, never>
    Functions: Record<string, never>
    Enums:     Record<string, never>
  }
}

/** Convenience: extract the Row type of any table. */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
