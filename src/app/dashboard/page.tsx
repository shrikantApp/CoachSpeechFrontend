'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/features/authSlice';
import { fetchHistory } from '@/lib/features/situationSlice';
import Navigation from '@/components/Navigation';
import { ToastContainer, useToast } from '@/components/Toast';
import {
    LayoutDashboard, MessageSquare, History, BookmarkCheck,
    Zap, TrendingUp, Clock, ChevronRight, PlusCircle, UserCircle
} from 'lucide-react';
import Link from 'next/link';

function StatCard({ icon, label, value, color }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
            <div className={`${color} p-3 rounded-xl`}>{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
        </div>
    );
}

export default function DashboardOverviewPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { situations } = useSelector((state: RootState) => state.situation as any);
    const { savedItems } = useSelector((state: RootState) => state.saved);
    const { toasts, removeToast } = useToast();

    useEffect(() => {
        if (!token) { router.push('/'); return; }
        if (!user) dispatch(fetchCurrentUser());
        dispatch(fetchHistory());
    }, [token, user, dispatch, router]);

    const recentSituations = [...situations].sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 3);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navigation />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="flex-1 md:ml-64">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Coach Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Welcome back, Coach {user.name.split(' ')[0]}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.sport_type || 'Coach'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-sm font-bold text-indigo-600 shadow-sm">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <StatCard icon={<TrendingUp className="w-6 h-6 text-blue-600" />} label="Total Situations" value={situations.length} color="bg-blue-50" />
                        <StatCard icon={<BookmarkCheck className="w-6 h-6 text-emerald-600" />} label="Saved Responses" value={savedItems.length} color="bg-emerald-50" />
                        <StatCard icon={<Zap className="w-6 h-6 text-amber-600" />} label="Current Plan" value="Premium" color="bg-amber-50" />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="xl:col-span-1 space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <PlusCircle className="w-5 h-5 text-indigo-500" />Quick Actions
                            </h2>
                            <div className="space-y-3">
                                <Link href="/dashboard/situation" className="flex items-center justify-between p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md transition-all group">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5" />
                                        <span className="font-semibold">Start New Situation</span>
                                    </div>
                                    <PlusCircle className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link href="/history" className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 border border-gray-100 text-gray-700 rounded-2xl shadow-sm transition-all group">
                                    <div className="flex items-center gap-3">
                                        <History className="w-5 h-5 text-indigo-500" />
                                        <span className="font-semibold">View History</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                </Link>
                                <Link href="/profile" className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 border border-gray-100 text-gray-700 rounded-2xl shadow-sm transition-all group">
                                    <div className="flex items-center gap-3">
                                        <UserCircle className="w-5 h-5 text-indigo-500" />
                                        <span className="font-semibold">Manage Profile</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-500" />Recent Situations
                                </h2>
                                <Link href="/history" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View All</Link>
                            </div>
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                {recentSituations.length > 0 ? (
                                    <div className="divide-y divide-gray-50">
                                        {recentSituations.map((sit: any) => (
                                            <div key={sit.id} className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-indigo-50 p-2.5 rounded-xl">
                                                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{sit.situation_type}</p>
                                                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{sit.description}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${sit.urgency === 'Immediate' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {sit.urgency}
                                                    </span>
                                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(sit.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <div className="bg-gray-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                            <MessageSquare className="w-8 h-8 text-indigo-200" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 ">No activity yet</h3>
                                        <p className="text-sm text-gray-500 mt-1 max-w-[200px] mx-auto">Start a new situation to see it appear here.</p>
                                        <Link href="/dashboard/situation" className="inline-block mt-4 text-sm font-bold text-indigo-600 hover:underline">Start Now</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
