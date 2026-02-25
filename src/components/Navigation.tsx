'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { logout } from '@/lib/features/authSlice';
import { useState } from 'react';
import {
    Dumbbell, LayoutDashboard, History, LogOut,
    BookmarkCheck, UserCircle, MessageSquare, Menu, X, ChevronRight,
    CreditCard, Zap
} from 'lucide-react';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Situation Input', path: '/dashboard/situation', icon: <MessageSquare className="w-5 h-5" /> },
        { name: 'History', path: '/history', icon: <History className="w-5 h-5" /> },
        { name: 'Saved Responses', path: '/saved', icon: <BookmarkCheck className="w-5 h-5" /> },
        { name: 'Subscription', path: '/subscription', icon: <Zap className="w-5 h-5" /> },
        { name: 'Billing & Usage', path: '/subscription/billing', icon: <CreditCard className="w-5 h-5" /> },
    ];

    const profileItemNav = { name: 'Coach Profile', path: '/profile', icon: <UserCircle className="w-5 h-5" /> };

    const Sidebar = ({ mobile = false }) => (
        <nav className={`${mobile ? 'flex' : 'hidden md:flex'} fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-indigo-950 to-indigo-900 text-white flex-col z-40 shadow-2xl`}>
            {/* Logo */}
            <div className="p-6 flex items-center space-x-3 border-b border-indigo-800/60">
                <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
                    <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Coach Speech</span>
                {mobile && (
                    <button onClick={() => setMobileOpen(false)} className="ml-auto text-indigo-300 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Coach Profile Link */}
            <div className="px-4 pt-4">
                <Link
                    href={profileItemNav.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${pathname === profileItemNav.path
                        ? 'bg-indigo-500/30 text-white border border-indigo-500/40'
                        : 'text-indigo-200 hover:bg-white/5 hover:text-white'}`}
                >
                    {profileItemNav.icon}
                    <span className="font-medium text-sm">{profileItemNav.name}</span>
                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                </Link>
            </div>

            {/* Divider */}
            <div className="mx-4 mt-3 border-t border-indigo-800/40" />

            {/* Main Nav */}
            <div className="flex-1 py-4 flex flex-col space-y-1 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'text-indigo-200 hover:bg-white/5 hover:text-white'}`}
                        >
                            {item.icon}
                            <span className="font-medium text-sm">{item.name}</span>
                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                        </Link>
                    );
                })}
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-indigo-800/60 space-y-2">
                {user && (
                    <div className="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-xl mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold uppercase">
                            {user.name?.charAt(0) || 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-indigo-300 truncate">{user.sport_type || 'Coach'}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-indigo-200 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors duration-200 group"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </nav>
    );

    return (
        <>
            <Sidebar />
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-50 md:hidden bg-indigo-900 text-white p-2 rounded-xl shadow-lg"
            >
                <Menu className="w-5 h-5" />
            </button>
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
                    <Sidebar mobile />
                </>
            )}
        </>
    );
}
