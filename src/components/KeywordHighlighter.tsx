'use client';

import React from 'react';

const EMPATHY_WORDS = ['understand', 'appreciate', 'concern', 'value', 'support', 'care', 'respect', 'empathy', 'feel', 'acknowledge', 'hear', 'recognize'];
const PROFESSIONAL_WORDS = ['policy', 'review', 'recommend', 'professional', 'encourage', 'procedure', 'standards', 'commitment', 'process', 'ensure', 'address', 'assess'];

function escapeRegex(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface KeywordHighlighterProps {
    text: string;
    className?: string;
}

export default function KeywordHighlighter({ text, className = '' }: KeywordHighlighterProps) {
    if (!text) return null;

    const allWords = [
        ...EMPATHY_WORDS.map(w => ({ word: w, type: 'empathy' as const })),
        ...PROFESSIONAL_WORDS.map(w => ({ word: w, type: 'professional' as const })),
    ];

    const pattern = allWords.map(w => escapeRegex(w.word)).join('|');
    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Text before this match
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        const matchedWord = match[0].toLowerCase();
        const isEmpathy = EMPATHY_WORDS.some(w => w === matchedWord);
        parts.push(
            <mark
                key={match.index}
                className={isEmpathy
                    ? 'bg-blue-100 text-blue-700 rounded px-0.5 font-medium not-italic'
                    : 'bg-green-100 text-green-700 rounded px-0.5 font-medium not-italic'}
            >
                {match[0]}
            </mark>
        );
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return <span className={className}>{parts}</span>;
}
