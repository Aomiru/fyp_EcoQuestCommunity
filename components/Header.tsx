'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import { useAuth, signInWithGoogle, signOut } from '@/lib/auth'

interface HeaderProps {
    user: any
    userStats: any
    authLoading: boolean
}

export default function Header({ user, userStats, authLoading }: HeaderProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    const getLevelGradient = (level: number) => {
        if (level >= 50) return 'from-purple-600 via-pink-500 to-rose-500';
        if (level >= 30) return 'from-orange-500 via-red-500 to-pink-500';
        if (level >= 15) return 'from-blue-500 via-cyan-500 to-teal-500';
        return 'from-green-500 via-emerald-500 to-teal-500';
    };

    return (
        <header className="sticky top-0 z-10 bg-[url('/background.svg')] bg-cover bg-center lg:bg-[center_30%] shadow-md">
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
    )
}
