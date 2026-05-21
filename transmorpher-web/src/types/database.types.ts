/**
 * Transmorpher Hub — Database Type Definitions
 *
 * These types mirror the Supabase PostgreSQL schema defined in
 * `supabase/migrations/001_initial_schema.sql`.
 *
 * Once the Supabase CLI is connected, you can auto-generate these with:
 *   pnpm supabase gen types typescript --local > src/types/database.types.ts
 *
 * Until then, this hand-crafted file serves as the single source of truth.
 */

// ---------------------------------------------------------------------------
// Row Types — what you get back from a SELECT
// ---------------------------------------------------------------------------

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Loadout {
  id: string;
  author_id: string;
  title: string;
  description: string | null;
  class_id: number | null;
  race_id: number | null;
  import_string: string;
  parsed_data: LoadoutParsedData;
  screenshot_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Upvote {
  user_id: string;
  loadout_id: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Insert / Update variants
// ---------------------------------------------------------------------------

export interface ProfileInsert {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
}

export interface ProfileUpdate {
  username?: string | null;
  avatar_url?: string | null;
}

export interface LoadoutInsert {
  id?: string;
  author_id: string;
  title: string;
  description?: string | null;
  class_id?: number | null;
  race_id?: number | null;
  import_string: string;
  parsed_data: LoadoutParsedData;
  screenshot_url?: string | null;
}

export interface LoadoutUpdate {
  title?: string;
  description?: string | null;
  class_id?: number | null;
  race_id?: number | null;
  import_string?: string;
  parsed_data?: LoadoutParsedData;
  screenshot_url?: string | null;
}

export interface UpvoteInsert {
  user_id: string;
  loadout_id: string;
}

// ---------------------------------------------------------------------------
// Parsed Data — the JSONB shape stored inside a Loadout
// This will be expanded in Phase 2 once we reverse-engineer the addon export.
// ---------------------------------------------------------------------------

export interface ItemSlot {
  slot_id: number;
  display_id: number;
  item_id?: number;
  enchant_id?: number;
}

export interface MorphState {
  morph_id?: number;
  mount_id?: number;
  scale?: number;
}

export interface LoadoutParsedData {
  items: ItemSlot[];
  morph?: MorphState;
  /** Raw key-value pairs we haven't mapped to a typed field yet. */
  extras?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Supabase Client Generic — plug into createClient<Database>(...)
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      loadouts: {
        Row: Loadout;
        Insert: LoadoutInsert;
        Update: LoadoutUpdate;
      };
      upvotes: {
        Row: Upvote;
        Insert: UpvoteInsert;
        Update: never; // upvotes are insert-or-delete only
      };
    };
    Views: {
      loadout_upvote_counts: {
        Row: {
          loadout_id: string;
          upvote_count: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
