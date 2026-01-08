import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions
export type CommunityPost = {
  id: string
  user_id: string
  user_name: string | null
  user_avatar_url: string | null
  journal_entry_id: string | null
  caption: string | null
  image_url: string
  species_name: string | null
  species_scientific_name: string | null
  species_category: string | null
  species_type: string | null
  species_data: any | null
  location: string | null
  latitude: number | null
  longitude: number | null
  created_at: string
  updated_at: string
  // Post type
  post_type?: 'species' | 'quest' | 'progress'
  // Quest-related fields
  quest_id?: string | null
  quest_name?: string | null
  quest_description?: string | null
  quest_reflection?: string | null
  objectives?: any | null
  notes?: string | null
  stats_data?: any | null
  // Progress-related fields
  user_level?: number | null
  user_exp?: number | null
  user_points?: number | null
  users?: {
    name: string | null
    profile_image: string | null
  }
}

export type CommunityPostLike = {
  id: number
  post_id: string
  user_id: string
  created_at: string
}

export type CommunityPostComment = {
  id: number
  post_id: string
  user_id: string
  content: string
  created_at: string
}
