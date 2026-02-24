'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/features/authSlice';
import { fetchHistory } from '@/lib/features/situationSlice';
import Navigation from '@/components/Navigation';
import { Clock, MessageSquare, AlertCircle, Eye, X, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HistoryPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { situations, isLoading } = useSelector((state: RootState) => state.situation as any);

    // Pagination & Filtering state
    const [currentPage, setCurrentPage] = useState(1);
    const [filterSport, setFilterSport] = useState('All');
    const itemsPerPage = 5;

    // Modal state
    const [selectedSituation, setSelectedSituation] = useState<any>(null);

    // Derived State
    const filteredSituations = situations.filter((s: any) => filterSport === 'All' || s.sport_type === filterSport);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSituations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSituations.length / itemsPerPage);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    useEffect(() => {
        if (!token) {
            router.push('/');
        } else if (!user) {
            dispatch(fetchCurrentUser());
        } else {
            dispatch(fetchHistory());
        }
    }, [token, user, dispatch, router]);

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navigation />
            <div className="flex-1 md:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Clock className="w-8 h-8 mr-3 text-indigo-500" />
                        Situation History
                    </h1>
                    <p className="text-gray-500 mt-2">View past communications and generated responses.</p>
                </header>

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-pulse flex space-x-4 text-indigo-500 font-medium">Loading history...</div>
                    </div>
                ) : situations.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No history yet</h3>
                        <p className="text-gray-500">Go to the Dashboard to create your first professional response.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-gray-200">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Filter by Sport:</span>
                            <select
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                                value={filterSport}
                                onChange={(e) => { setFilterSport(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="All">All Sports</option>
                                {Array.from(new Set(situations.map((s: any) => s.sport_type))).map((sport: any) => (
                                    <option key={sport} value={sport}>{sport}</option>
                                ))}
                            </select>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Date</th>
                                            <th scope="col" className="px-6 py-4">Sport / Age</th>
                                            <th scope="col" className="px-6 py-4">Situation Type</th>
                                            <th scope="col" className="px-6 py-4">Preview</th>
                                            <th scope="col" className="px-6 py-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((situation: any) => (
                                            <tr key={situation.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    {new Date(situation.created_at).toLocaleDateString(undefined, {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                        {situation.sport_type} • {situation.athlete_age_group}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900">{situation.situation_type}</td>
                                                <td className="px-6 py-4 truncate max-w-[200px]" title={situation.description}>
                                                    {situation.description}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setSelectedSituation(situation)}
                                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors inline-block"
                                                        aria-label="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredSituations.length)}</span> of <span className="font-medium">{filteredSituations.length}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                <button
                                                    onClick={prevPage}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                                                </button>
                                                <button
                                                    onClick={nextPage}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedSituation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{selectedSituation.situation_type}</h3>
                                <p className="text-sm text-gray-500">
                                    {new Date(selectedSituation.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedSituation(null)}
                                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Context Sidebar */}
                                <div className="space-y-4 md:col-span-1 border-r border-gray-100 pr-4">
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Sport & Age</h4>
                                        <p className="text-sm font-medium text-gray-800">{selectedSituation.sport_type} • {selectedSituation.athlete_age_group}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Parent</h4>
                                        <p className="text-sm text-gray-700">{selectedSituation.parent_behavior}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Channel</h4>
                                        <p className="text-sm text-gray-700">{selectedSituation.channel}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Tone</h4>
                                        <p className="text-sm text-gray-700">{selectedSituation.tone}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Urgency</h4>
                                        <p className="text-sm text-gray-700">{selectedSituation.urgency || 'Standard'}</p>
                                    </div>
                                </div>

                                {/* Description & Response */}
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <MessageSquare className="w-4 h-4 mr-2 text-gray-400" />
                                            Original Description
                                        </h4>
                                        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 border border-gray-100 italic">
                                            "{selectedSituation.description}"
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center text-sm font-semibold text-indigo-700 mb-2">
                                            <AlertCircle className="w-4 h-4 mr-2 text-indigo-500" />
                                            Generated Response
                                        </h4>
                                        <div className="bg-indigo-50/50 rounded-xl p-5 text-sm text-gray-800 border border-indigo-100 whitespace-pre-wrap leading-relaxed">
                                            {selectedSituation.primary_response}
                                        </div>
                                    </div>

                                    {selectedSituation.alternate_responses && selectedSituation.alternate_responses.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Alternate Variations</h4>
                                            <div className="space-y-3">
                                                {selectedSituation.alternate_responses.map((alt: string, idx: number) => (
                                                    <div key={idx} className="bg-white rounded-xl p-4 text-sm text-gray-600 border border-gray-200">
                                                        {alt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedSituation.keywords && selectedSituation.keywords.length > 0 && (
                                        <div className="pt-4 border-t border-gray-100">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Empathy Keywords</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSituation.keywords.map((word: string, i: number) => (
                                                    <span key={i} className="text-[11px] font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                        {word}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-right text-xs text-gray-400">
                            Saved to Database
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
