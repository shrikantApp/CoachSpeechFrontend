'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
};

const borders = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
};

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onClose, 300);
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`flex items-center gap-3 bg-gray-900 border ${borders[type]} rounded-xl px-4 py-3 shadow-2xl min-w-[280px] max-w-sm ${exiting ? 'toast-exit' : 'toast-enter'}`}
        >
            {icons[type]}
            <p className="text-sm text-white flex-1 font-medium">{message}</p>
            <button
                onClick={() => { setExiting(true); setTimeout(onClose, 300); }}
                className="text-gray-500 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Toast Container
interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContainerProps {
    toasts: ToastItem[];
    removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            {toasts.map(t => (
                <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
            ))}
        </div>
    );
}

// Hook
export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = (message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, addToast, removeToast };
}
