// ProgressPostCard.tsx
// Next.js component for displaying user progress posts on the community website

import React from 'react';
import Image from 'next/image';
import {
    Calendar,
    TrendingUp,
    Award,
    CheckCircle,
    Heart,
    MessageCircle,
    Share2,
    Leaf,
    Bird,
    Sparkles,
} from 'lucide-react';

interface StatsData {
    quests_completed: number;
    active_quests?: number;
    total_quests?: number;
    species_discovered: number;
    flora_count: number;
    fauna_count: number;
    total_captures: number;
    exp_into_level: number;
    exp_cap: number;
}

interface ProgressPost {
    id: string;
    user_id: string;
    user_name: string;
    user_profile_image?: string;
    post_type: 'progress';
    caption?: string;
    image_url?: string;
    user_level: number;
    user_exp: number;
    user_points?: number;
    stats_data: StatsData;
    created_at: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
}

interface ProgressPostCardProps {
    post: ProgressPost;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
    onShare: (postId: string) => void;
}

export default function ProgressPostCard({
    post,
    onLike,
    onComment,
    onShare,
}: ProgressPostCardProps) {
    const stats = post.stats_data;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return formatDate(dateString);
    };



    return (
        <article
            className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-2xl mx-auto mb-8 hover:shadow-2xl transition-shadow duration-300"
        >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-4">
                    {post.user_profile_image ? (
                        <img
                            src={post.user_profile_image}
                            alt={post.user_name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-green-200 shadow-md"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xl">
                                {post.user_name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{post.user_name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <span>Achieved • {getTimeAgo(post.created_at)}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Caption */}
            {post.caption && (
                <div className="p-6 border-y border-gray-100 bg-blue-50/30">
                    <p className="text-gray-800 leading-relaxed font-medium text-base text-center italic">"{post.caption}"</p>
                </div>
            )}

            {/* Stats Grid with Vibrant Colors */}
            <div className="p-6">
                <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                    <Award size={22} className="text-amber-500" />
                    <span>Achievements</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    {/* Quests Completed */}
                    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-green-100 rounded-lg">
                                <CheckCircle className="text-green-600" size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Quests</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900 mb-1">
                            {stats.quests_completed}
                        </p>
                        <p className="text-xs font-medium text-green-600">Completed</p>
                    </div>

                    {/* Species Discovered */}
                    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                <TrendingUp className="text-blue-600" size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Species</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900 mb-1">
                            {stats.species_discovered}
                        </p>
                        <p className="text-xs font-medium text-blue-600">Discovered</p>
                    </div>

                    {/* Flora Count */}
                    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-lime-100 rounded-lg">
                                <Leaf className="text-lime-600" size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Flora</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900 mb-1">{stats.flora_count}</p>
                        <p className="text-xs font-medium text-lime-600">Captured</p>
                    </div>

                    {/* Fauna Count */}
                    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-cyan-100 rounded-lg">
                                <Bird className="text-cyan-600" size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Fauna</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900 mb-1">{stats.fauna_count}</p>
                        <p className="text-xs font-medium text-cyan-600">Captured</p>
                    </div>
                </div>

                {/* Total Captures with Badge */}
                <div className="mt-4 flex items-center justify-center">
                    <div className="bg-amber-50 px-6 py-3 rounded-full border border-amber-100 flex items-center gap-3">
                        <span className="text-sm font-bold text-amber-900 uppercase tracking-wide">Total Captures</span>
                        <span className="text-2xl font-black text-amber-500">{stats.total_captures}</span>
                    </div>
                </div>
            </div>

            {/* Date */}
            <div className="px-5 py-4 border-t bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Calendar size={18} className="text-green-600" />
                    <span>Shared on {formatDate(post.created_at)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="p-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                <div className="flex gap-8">
                    <button
                        onClick={() => onLike(post.id)}
                        className={`flex items-center gap-2 transition-all hover:scale-110 ${post.is_liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                            }`}
                    >
                        <Heart size={24} fill={post.is_liked ? 'currentColor' : 'none'} strokeWidth={2} />
                        <span className="text-base font-bold">{post.likes_count}</span>
                    </button>
                    <button
                        onClick={() => onComment(post.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-all hover:scale-110"
                    >
                        <MessageCircle size={24} strokeWidth={2} />
                        <span className="text-base font-bold">{post.comments_count}</span>
                    </button>
                </div>
                <button
                    onClick={() => onShare(post.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-all hover:scale-110 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md"
                >
                    <Share2 size={20} strokeWidth={2} />
                    <span className="text-sm font-bold">Share</span>
                </button>
            </div>

            {/* CSS Animation for shimmer effect */}
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }
            `}</style>
        </article>
    );
}
