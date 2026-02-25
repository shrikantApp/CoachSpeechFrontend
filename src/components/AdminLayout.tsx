'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    Dumbbell, LayoutDashboard, Users, Database, BarChart2, PieChart,
    FileText, MessageSquare, LogOut, Search, Settings, ChevronRight,
    Bell, Menu, X
} from 'lucide-react';

import { useDispatch } from 'react-redux';
import { logout } from '@/lib/features/authSlice';

const NAV_ITEMS = [
    { name: 'Dashboard Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Manage Coaches', path: '/admin/coaches', icon: <Users className="w-4 h-4" /> },
    { name: 'Upload Datasets', path: '/admin/datasets', icon: <Database className="w-4 h-4" /> },
    { name: 'AI Usage Review', path: '/admin/ai-usage', icon: <BarChart2 className="w-4 h-4" /> },
    { name: 'Analytics & Quality', path: '/admin/analytics', icon: <PieChart className="w-4 h-4" /> },
    { name: 'Situations Log', path: '/admin/situations', icon: <FileText className="w-4 h-4" /> },
    { name: 'Coach Responses', path: '/admin/responses', icon: <MessageSquare className="w-4 h-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [search, setSearch] = useState('');

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    const Sidebar = ({ mobile = false }) => (
        <aside className={`${mobile ? 'flex' : 'hidden md:flex'} fixed left-0 top-0 bottom-0 w-60 bg-gray-950 text-white flex-col z-40 shadow-xl`}>
            <div className="p-5 flex items-center gap-3 border-b border-gray-800">
                <div className="bg-blue-600 p-2 rounded-xl">
                    <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <div>
                    <span className="text-sm font-bold text-white">Coach Speech</span>
                    <p className="text-xs text-gray-400">Admin Portal</p>
                </div>
                {mobile && (
                    <button onClick={() => setMobileOpen(false)} className="ml-auto text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map(item => {
                    const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path);
                    return (
                        <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-sm ${isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-gray-800 space-y-1">
                <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-sm">
                    <Settings className="w-4 h-4" /><span className="font-medium">Settings</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-900/40 hover:text-red-300 transition-all text-sm w-full">
                    <LogOut className="w-4 h-4" /><span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );

    const currentPage = NAV_ITEMS.find(i => i.path === '/admin' ? pathname === '/admin' : pathname.startsWith(i.path))?.name || 'Admin';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
                    <Sidebar mobile />
                </>
            )}

            <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-4 shadow-sm">
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-gray-500 hover:text-gray-900">
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 hidden sm:flex">
                        <Link href="/admin" className="hover:text-blue-600 transition-colors">Admin</Link>
                        {pathname !== '/admin' && (
                            <>
                                <ChevronRight className="w-3.5 h-3.5" />
                                <span className="text-gray-900 font-medium">{currentPage}</span>
                            </>
                        )}
                    </div>

                    {/* Search */}
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <button className="relative text-gray-500 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">A</div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-semibold text-gray-900">Admin</p>
                                <p className="text-xs text-gray-500">admin@coachspeech.com</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
