'use client'

import { useEffect, useState } from 'react'
import { supabase, type CommunityPost } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import PostCard from '@/components/PostCard'
import QuestPostCard from './QuestPostCard'
import ProgressPostCard from './ProgressPostCard'
import Header from '@/components/Header'

import { Zap, Sparkles } from 'lucide-react'

// ... existing imports

export default function Home() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState<any>(null)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserStats()
    }
  }, [user])

  async function fetchUserStats() {
    // Try to fetch user stats from a 'users' table or similar source
    // We start by selecting * to see what we have
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user!.id)
      .single()

    console.log('User Stats Fetch:', { data, error })

    if (data) {
      setUserStats(data)
    }
  }



  async function fetchPosts() {
    try {
      console.log('Fetching posts...')
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          users!community_posts_user_id_users_fkey (
            name,
            profile_image
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      console.log('Response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log(`Found ${data?.length || 0} posts`)
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #F5F5DC, #E8DCC0)' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent" style={{ borderColor: '#4CAF50', borderTopColor: 'transparent' }}></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #F5F5DC, #E8DCC0)' }}>
      {/* Header */}
      <Header user={user} userStats={userStats} authLoading={authLoading} />

      {/* Feed */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-xl" style={{
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="text-6xl mb-4">🌿</div>
            <p className="text-xl font-semibold italic" style={{ color: '#2E7D32' }}>
              No posts yet. Start <br />sharing from the app!
            </p>
            <p className="text-gray-500 mt-2">Be the first to share your discoveries</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              post.post_type === 'quest' ? (
                <QuestPostCard
                  key={post.id}
                  post={{
                    id: post.id,
                    user_id: post.user_id,
                    user_name: post.users?.name || post.user_name || 'Anonymous User',
                    user_profile_image: post.users?.profile_image || post.user_avatar_url || undefined,
                    post_type: 'quest',
                    quest_id: post.quest_id || '',
                    quest_name: post.quest_name || '',
                    quest_description: post.quest_description || '',
                    quest_reflection: post.quest_reflection || '',
                    objectives: post.objectives || [],
                    notes: post.notes || '',
                    caption: post.caption || '',
                    image_url: post.image_url,
                    location: post.location || '',
                    latitude: post.latitude ?? undefined,
                    longitude: post.longitude ?? undefined,
                    stats_data: post.stats_data || {
                      flora_count: 0,
                      fauna_count: 0,
                      total_species: 0,
                      flora_target: 0,
                      fauna_target: 0,
                      species_captured: [],
                      quest_category: '',
                      is_completed: false,
                      day: '',
                      date: '',
                      total_unique_species: 0,
                      duplicate_captures: 0
                    },
                    created_at: post.created_at,
                    likes_count: 0,
                    comments_count: 0,
                    is_liked: false
                  }}
                  onLike={(postId) => console.log('Like:', postId)}
                  onComment={(postId) => console.log('Comment:', postId)}
                  onShare={(postId) => console.log('Share:', postId)}
                />
              ) : post.post_type === 'progress' ? (
                <ProgressPostCard
                  key={post.id}
                  post={{
                    id: post.id,
                    user_id: post.user_id,
                    user_name: post.users?.name || post.user_name || 'Anonymous User',
                    user_profile_image: post.users?.profile_image || post.user_avatar_url || undefined,
                    post_type: 'progress',
                    caption: post.caption || '',
                    image_url: post.image_url,
                    user_level: post.user_level || 1,
                    user_exp: post.user_exp || 0,
                    user_points: post.user_points || 0,
                    stats_data: post.stats_data || {
                      quests_completed: 0,
                      species_discovered: 0,
                      flora_count: 0,
                      fauna_count: 0,
                      total_captures: 0,
                      exp_into_level: 0,
                      exp_cap: 100
                    },
                    created_at: post.created_at,
                    likes_count: 0,
                    comments_count: 0,
                    is_liked: false
                  }}
                  onLike={(postId) => console.log('Like:', postId)}
                  onComment={(postId) => console.log('Comment:', postId)}
                  onShare={(postId) => console.log('Share:', postId)}
                />
              ) : (
                <PostCard key={post.id} post={post} user={user} />
              )
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
