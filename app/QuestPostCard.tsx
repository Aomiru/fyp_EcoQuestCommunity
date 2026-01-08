// QuestPostCard.tsx
// Next.js component for displaying shared quest posts on the community website
// This component shows the complete quest with all species in a gallery format

import React, { useState } from 'react';
import {
    MapPin,
    Calendar,
    CheckCircle,
    Circle,
    Leaf,
    Bird,
    Award,
    Heart,
    MessageCircle,
    Share2
} from 'lucide-react';

interface Species {
    name: string;
    scientific_name: string;
    type: string;
    category: string;
    image_url: string;
    entry_id: string;
    conservation_status: string;
    confidence: number;
    location: string;
    capture_date: string;
}

interface Objective {
    id: string;
    text: string;
    isCompleted: boolean;
}

interface StatsData {
    flora_count: number;
    fauna_count: number;
    total_species: number;
    flora_target: number;
    fauna_target: number;
    species_captured: Species[];
    quest_category: string;
    is_completed: boolean;
    completed_date?: string;
    day: string;
    date: string;
    total_unique_species: number;
    duplicate_captures: number;
}

interface QuestPost {
    id: string;
    user_id: string;
    user_name: string;
    user_profile_image?: string;
    post_type: 'quest';
    quest_id: string;
    quest_name: string;
    quest_description: string;
    quest_reflection: string;
    objectives: Objective[];
    notes: string;
    caption: string;
    image_url: string;
    location: string;
    latitude?: number;
    longitude?: number;
    stats_data: StatsData;
    created_at: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
}

interface QuestPostCardProps {
    post: QuestPost;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
    onShare: (postId: string) => void;
}

export default function QuestPostCard({ post, onLike, onComment, onShare }: QuestPostCardProps) {
    const [showAllSpecies, setShowAllSpecies] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

    const stats = post.stats_data;
    const displayedSpecies = showAllSpecies
        ? stats.species_captured
        : stats.species_captured.slice(0, 6);

    const getConservationColor = (status: string) => {
        if (!status) return 'bg-green-600';
        const lower = status.toLowerCase();
        if (lower.includes('critically')) return 'bg-red-600';
        if (lower.includes('endangered')) return 'bg-orange-600';
        if (lower.includes('vulnerable')) return 'bg-yellow-600';
        return 'bg-green-600';
    };

    const getProgressPercentage = (count: number, target: number) => {
        return target > 0 ? Math.min((count / target) * 100, 100) : 0;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
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
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-3xl mx-auto mb-8 hover:shadow-2xl transition-shadow duration-300">
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
                            <span>Completed a quest • {getTimeAgo(post.created_at)}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Quest Title */}
            <div className="p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                <div>
                    <p className="text-green-500 leading-relaxed text-base">Quest Title :</p>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    {post.quest_name}
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">{post.quest_description}</p>
            </div>

            {/* Objectives */}
            {post.objectives && post.objectives.length > 0 && (
                <div className="p-6 border-b border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                        <span className="text-xl">✓</span>
                        <span>To do?</span>
                    </h4>
                    <div>
                        {post.objectives.map((objective) => (
                            <div key={objective.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                {objective.isCompleted ? (
                                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={22} />
                                ) : (
                                    <Circle className="text-gray-300 flex-shrink-0 mt-0.5" size={22} />
                                )}
                                <span className={`text-base ${objective.isCompleted ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                                    {objective.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Progress */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <span>Progress</span>
                </h4>
                <div className="grid grid-cols-1 gap-5">
                    {/* Flora Progress */}
                    {stats.flora_target > 0 && (
                        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Leaf className="text-green-600" size={22} />
                                </div>
                                <span className="font-bold text-gray-800 text-lg">Flora</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-3xl font-bold text-green-600">
                                    {stats.flora_count}
                                </span>
                                <span className="text-gray-500 font-medium">/ {stats.flora_target}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                                    style={{ width: `${getProgressPercentage(stats.flora_count, stats.flora_target)}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-medium">
                                {getProgressPercentage(stats.flora_count, stats.flora_target).toFixed(0)}% Complete
                            </p>
                        </div>
                    )}

                    {/* Fauna Progress */}
                    {stats.fauna_target > 0 && (
                        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Bird className="text-blue-600" size={22} />
                                </div>
                                <span className="font-bold text-gray-800 text-lg">Fauna</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-3xl font-bold text-blue-600">
                                    {stats.fauna_count}
                                </span>
                                <span className="text-gray-500 font-medium">/ {stats.fauna_target}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                                    style={{ width: `${getProgressPercentage(stats.fauna_count, stats.fauna_target)}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-medium">
                                {getProgressPercentage(stats.fauna_count, stats.fauna_target).toFixed(0)}% Complete
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Species Gallery */}
            <div className="p-6 border-b border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                    <span className="text-xl">🖼️</span>
                    <span>Species Gallery</span>
                    <span className="text-sm font-semibold text-gray-500 ml-1">({stats.species_captured.length})</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {displayedSpecies.map((species, index) => (
                        <div
                            key={`${species.entry_id}-${index}`}
                            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
                            onClick={() => setSelectedSpecies(species)}
                        >
                            <img
                                src={species.image_url}
                                alt={species.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-white text-sm font-bold truncate drop-shadow-lg">
                                        {species.name}
                                    </p>
                                    <p className="text-white/90 text-xs italic truncate drop-shadow-md">
                                        {species.scientific_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {stats.species_captured.length > 6 && !showAllSpecies && (
                    <button
                        onClick={() => setShowAllSpecies(true)}
                        className="mt-4 w-full py-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all font-bold shadow-sm hover:shadow-md"
                    >
                        View all {stats.species_captured.length} species →
                    </button>
                )}
            </div>

            {/* Reflection */}
            {post.quest_reflection && (
                <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-amber-50 to-orange-50">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                        <span className="text-xl">💭</span>
                        <span>Reflection</span>
                    </h4>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border-l-4 border-amber-400">
                        <p className="text-gray-800 leading-relaxed italic text-base font-medium">
                            "{post.quest_reflection}"
                        </p>
                    </div>
                </div>
            )}

            {/* Location & Date Info */}
            <div className="p-5 border-b border-gray-100 bg-gray-50">
                <div className="flex flex-col gap-2 text-sm">
                    {post.location && (
                        <div className="flex items-center gap-2 text-gray-700">
                            <MapPin size={18} className="text-green-600" />
                            <span className="font-medium">{post.location}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={18} className="text-green-600" />
                        <span className="font-medium">{stats.day} • {stats.date}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
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

            {/* Species Detail Modal */}
            {selectedSpecies && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedSpecies(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-96">
                            <img
                                src={selectedSpecies.image_url}
                                alt={selectedSpecies.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setSelectedSpecies(null)}
                                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white transition-colors text-red-500 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {selectedSpecies.name}
                            </h3>
                            <p className="text-gray-600 italic mb-4">
                                {selectedSpecies.scientific_name}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
