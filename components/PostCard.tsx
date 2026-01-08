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
    <article className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-3xl mx-auto mb-8 hover:shadow-2xl transition-shadow duration-300">
      {/* User Header */}
      <div className="p-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={displayName}
              className="w-14 h-14 rounded-full object-cover border-2 border-green-200 shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">
                {displayName[0].toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{displayName}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span>Shared a discovery • {timeAgo}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={post.image_url}
          alt={post.species_name ?? 'Species image'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Species Info & Caption */}
      <div className="p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="mb-4">
          <div>
            <p className="text-green-500 leading-relaxed text-base">Species :</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {post.species_name}
          </h2>
          <p className="text-gray-700 leading-relaxed text-base italic">
            {post.species_scientific_name}
          </p>
        </div>

        {post.caption && (
          <div className="mt-4 pt-4 border-t border-green-100/50">
            <p className="text-gray-800 leading-relaxed text-base font-medium">
              "{post.caption}"
            </p>
          </div>
        )}
      </div>

      {/* Like and Comment Actions */}
      <div className="p-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
        <div className="flex gap-8">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-2 transition-all hover:scale-110 ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
          >
            <svg
              className={`w-6 h-6 transition-colors`}
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-base font-bold">
              {likesCount}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-all hover:scale-110"
          >
            <svg
              className="w-6 h-6 transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-base font-bold">
              {comments.length}
            </span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-gray-50 p-5 border-t border-gray-100">
          {/* Comments List */}
          <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-xl p-4 bg-white shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-gray-900">User</p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm text-gray-700 font-medium">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex gap-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={user ? "Add a comment..." : "Sign in to comment"}
              disabled={!user || loading}
              className="flex-1 min-w-0 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium bg-white"
            />
            <button
              type="submit"
              disabled={!user || !commentText.trim() || loading}
              className="shrink-0 px-6 py-3 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  )
}
