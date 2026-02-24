'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/lib/features/authSlice';
import { Dumbbell, LayoutDashboard, History, LogOut } from 'lucide-react';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'History', path: '/history', icon: <History className="w-5 h-5" /> },
    ];

    return (
        <nav className="fixed left-0 top-0 bottom-0 w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
            <div className="p-6 flex items-center space-x-3 border-b border-indigo-800">
                <Dumbbell className="w-8 h-8 text-indigo-400" />
                <span className="text-xl font-bold tracking-wide">Coach Speech</span>
            </div>

            <div className="flex-1 py-8 flex flex-col space-y-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-indigo-200 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-indigo-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-indigo-200 hover:bg-white/5 hover:text-white rounded-xl transition-colors duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </nav>
    );
}
