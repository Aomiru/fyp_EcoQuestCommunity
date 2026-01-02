'use client'

import { useState, useEffect } from 'react'
import type { CommunityPost } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/auth'
import { formatDistanceToNow } from 'date-fns'
import type { User } from '@supabase/supabase-js'

interface PostCardProps {
  post: CommunityPost
  user: User | null
}

export default function PostCard({ post, user }: PostCardProps) {
  const displayName = post.users?.name || post.user_name || 'Anonymous User'
  const userAvatar = post.users?.profile_image || post.user_avatar_url
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
  
  const [likesCount, setLikesCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLikes()
    fetchComments()
  }, [post.id, user])

  async function fetchLikes() {
    const { count } = await supabase
      .from('community_post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post.id)
    
    setLikesCount(count || 0)

    if (user) {
      const { data } = await supabase
        .from('community_post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single()
      
      setIsLiked(!!data)
    }
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('community_post_comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
    
    setComments(data || [])
  }

  async function handleLike() {
    if (!user) {
      if (confirm('You need to sign in to like posts. Sign in now?')) {
        signInWithGoogle()
      }
      return
    }

    setLoading(true)
    
    if (isLiked) {
      // Unlike
      await supabase
        .from('community_post_likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.id)
      
      setIsLiked(false)
      setLikesCount(prev => prev - 1)
    } else {
      // Like
      await supabase
        .from('community_post_likes')
        .insert({ post_id: post.id, user_id: user.id })
      
      setIsLiked(true)
      setLikesCount(prev => prev + 1)
    }
    
    setLoading(false)
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    
    if (!user) {
      if (confirm('You need to sign in to comment. Sign in now?')) {
        signInWithGoogle()
      }
      return
    }

    if (!commentText.trim()) return

    setLoading(true)
    
    const { data, error } = await supabase
      .from('community_post_comments')
      .insert({
        post_id: post.id,
        user_id: user.id,
        content: commentText
      })
      .select()
      .single()

    if (!error && data) {
      setComments([...comments, data])
      setCommentText('')
    }
    
    setLoading(false)
  }

  return (
    <article className="bg-white rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300" style={{
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
    }}>
      {/* User Header */}
      <div className="p-5 flex items-center gap-3 bg-linear-to-r from-green-50 to-blue-50">
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover border-2 shadow-md"
            style={{ borderColor: '#4CAF50' }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md" style={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)'
          }}>
            {displayName[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <p className="font-bold text-lg" style={{ color: '#2E7D32' }}>{displayName}</p>
          <p className="text-sm text-gray-500 font-medium">{timeAgo}</p>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={post.image_url}
          alt={post.species_name ?? 'Species image'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Species Info & Caption */}
      <div className="p-5">
        <div className="mb-4">
          <h2 className="text-2xl font-bold italic" style={{ 
            color: '#2E7D32',
            letterSpacing: '-0.5px'
          }}>
            {post.species_name}
          </h2>
          <p className="text-sm italic font-medium" style={{ color: '#66BB6A' }}>
            {post.species_scientific_name}
          </p>
        </div>
        
        {post.caption && (
          <p className="text-gray-700 leading-relaxed text-base">
            {post.caption}
          </p>
        )}
      </div>

      {/* Like and Comment Actions */}
      <div className="px-5 pb-5 border-t pt-4" style={{ borderColor: '#E0E0E0' }}>
        <div className="flex items-center gap-6 mb-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={loading}
            className="flex items-center gap-2 group transition-transform hover:scale-110"
          >
            <svg
              className={`w-7 h-7 transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : 'group-hover:text-red-500'
              }`}
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              style={{ color: isLiked ? '#E91E63' : '#666' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm font-bold" style={{ color: isLiked ? '#E91E63' : '#666' }}>
              {likesCount} {likesCount === 1 ? 'like' : 'likes'}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 group transition-transform hover:scale-110"
          >
            <svg
              className="w-7 h-7 transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              style={{ color: showComments ? '#4CAF50' : '#666' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-bold" style={{ color: showComments ? '#4CAF50' : '#666' }}>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-3">
            {/* Comments List */}
            <div className="max-h-60 overflow-y-auto">
            {comments.map((comment) => (
                  <div key={comment.id} className="rounded-2xl p-4" style={{ 
                    backgroundColor: '#F5F5DC',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}>
                    <p className="text-sm font-bold" style={{ color: '#2E7D32' }}>User</p>
                    <p className="text-sm text-gray-700 mt-1 font-medium">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                ))}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={user ? "Add a comment..." : "Sign in to comment"}
                disabled={!user || loading}
                className="flex-1 min-w-0 px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all font-medium"
                style={{
                  borderColor: user ? '#4CAF50' : '#E0E0E0',
                  backgroundColor: user ? 'white' : '#F5F5F5',
                  color: '#000000'
                }}
              />
              <button
                type="submit"
                disabled={!user || !commentText.trim() || loading}
                className="shrink-0 px-6 py-3 text-white rounded-2xl font-bold transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                style={{ 
                  background: user && commentText.trim() ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' : '#CCCCCC'
                }}
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  )
}
