import { useState, useEffect } from 'react';

const HISTORY_STORAGE_KEY = 'cyberedt_explainhacker_history';

/** Save history to localStorage */
export const saveHistoryToStorage = (history) => {
    try {
        if (localStorage.getItem('cyberedt_consent') === 'accepted') {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        } else {
            localStorage.removeItem(HISTORY_STORAGE_KEY);
        }
    } catch (error) {
        console.warn('Failed to save history to localStorage:', error);
    }
};

/** Load history from localStorage */
export const loadHistoryFromStorage = () => {
    try {
        if (localStorage.getItem('cyberedt_consent') === 'accepted') {
            const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (!stored) return [];
            return JSON.parse(stored) || [];
        }
        return [];
    } catch (error) {
        console.warn('Failed to load history from localStorage:', error);
        return [];
    }
};

export default function useSimulationHistory() {
    const [history, setHistory] = useState(() => loadHistoryFromStorage());

    useEffect(() => {
        saveHistoryToStorage(history);

        // Also save history immediately when consent changes
        const handleConsentChanged = () => {
            saveHistoryToStorage(history);
        };
        window.addEventListener('storage-consent-changed', handleConsentChanged);
        return () => window.removeEventListener('storage-consent-changed', handleConsentChanged);
    }, [history]);

    return [history, setHistory];
}
