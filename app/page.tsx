'use client'

import { useEffect, useState } from 'react'
import { supabase, type CommunityPost } from '@/lib/supabase'
import { useAuth, signInWithGoogle, signOut } from '@/lib/auth'
import PostCard from '@/components/PostCard'
import QuestPostCard from './QuestPostCard'
import ProgressPostCard from './ProgressPostCard'

import { Zap, Sparkles } from 'lucide-react'

// ... existing imports

export default function Home() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
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

  const getLevelGradient = (level: number) => {
    if (level >= 50) return 'from-purple-600 via-pink-500 to-rose-500';
    if (level >= 30) return 'from-orange-500 via-red-500 to-pink-500';
    if (level >= 15) return 'from-blue-500 via-cyan-500 to-teal-500';
    return 'from-green-500 via-emerald-500 to-teal-500';
  };

  const getLevelBadgeGlow = (level: number) => {
    if (level >= 50) return '0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(236, 72, 153, 0.2)';
    if (level >= 30) return '0 0 40px rgba(249, 115, 22, 0.4), 0 0 80px rgba(239, 68, 68, 0.2)';
    if (level >= 15) return '0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(6, 182, 212, 0.2)';
    return '0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(20, 184, 166, 0.2)';
  };

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
      <header className="sticky top-0 z-10" style={{
        backgroundImage: 'url(/background.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="max-w-4xl mx-auto px-6 py-6 relative">
          {/* Empty spacer for centering */}
          <div className="absolute top-6 left-6 w-12 h-12"></div>

          <div className="text-center">
            <h1 className="text-5xl font-bold text-white italic" style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2), -1px -1px 0 #2E7D32, 1px -1px 0 #2E7D32, -1px 1px 0 #2E7D32, 1px 1px 0 #2E7D32',
              letterSpacing: '-0.5px'
            }}>
              EcoQuest Community
            </h1>
            <p className="text-green-700/90 mt-2 text-base font-medium" style={{
              textShadow: '0 0 4px rgba(255, 255, 255, 0.8), -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white'
            }}>
              Discover amazing species shared by our community
            </p>

            {/* User Level Progress Header */}
            {user && userStats && (
              <div className="mt-8 max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 flex items-center gap-6 animate-fade-in-up">
                <div className={`relative flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${getLevelGradient(userStats.level || 1)} shadow-lg`}>
                  <div className="absolute inset-1 bg-white/90 rounded-full flex flex-col items-center justify-center">
                    <Zap className="text-yellow-500 mb-0.5" size={14} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Lvl</span>
                    <span className="text-2xl font-black bg-clip-text text-transparent" style={{
                      backgroundImage: `linear-gradient(135deg, ${(userStats.level || 1) >= 50 ? '#9333ea, #ec4899' : (userStats.level || 1) >= 30 ? '#f97316, #ef4444' : (userStats.level || 1) >= 15 ? '#3b82f6, #06b6d4' : '#22c55e, #14b8a6'})`
                    }}>
                      {userStats.level || 1}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-bold text-gray-800">
                      Progress to Level {(userStats.level || 1) + 1}
                    </span>
                    <span className="text-sm font-bold text-yellow-600">
                      {Math.min(((userStats.exp || 0) / (userStats.exp_cap || 100)) * 100, 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{
                        width: `${Math.min(((userStats.exp || 0) / (userStats.exp_cap || 100)) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s infinite linear',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs font-semibold text-gray-500">
                      {(userStats.exp || 0).toLocaleString()} XP
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {(userStats.exp_cap || 100).toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auth Button */}
          <div className="absolute top-2 right-2">
            {authLoading ? (
              <div className="h-10 w-10 rounded-full bg-white/30 animate-pulse"></div>
            ) : user ? (
              <>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="relative"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border-3 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-3 border-white hover:scale-110 transition-transform cursor-pointer" style={{
                      background: 'linear-gradient(135deg, #FF9800 0%, #FF6F00 100%)'
                    }}>
                      {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl overflow-hidden" style={{
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div className="p-4 border-b" style={{ borderColor: '#E8DCC0' }}>
                      <p className="font-bold text-base" style={{ color: '#2E7D32' }}>
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false)
                        signOut()
                      }}
                      className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5" style={{ color: '#FF9800' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-semibold" style={{ color: '#FF9800' }}>Sign out</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center bg-white rounded-3xl px-3 py-3 hover:scale-105 transition-transform shadow-lg font-semibold"
                style={{ color: '#2E7D32' }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

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
