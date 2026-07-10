import React, { useState } from 'react';

function readConsent() {
    try {
        return window.localStorage?.getItem('cyberedt_consent');
    } catch {
        return 'declined';
    }
}

function writeConsent(value) {
    try {
        window.localStorage?.setItem('cyberedt_consent', value);
    } catch {
        // Storage can be unavailable in private mode, WebViews, or file shells.
    }
}

export default function ConsentBanner() {
    const [isVisible, setIsVisible] = useState(() => !readConsent());

    const handleAccept = () => {
        writeConsent('accepted');
        setIsVisible(false);
        // Dispatch an event so other components know consent changed
        window.dispatchEvent(new Event('storage-consent-changed'));
    };

    const handleDecline = () => {
        writeConsent('declined');
        setIsVisible(false);
        window.dispatchEvent(new Event('storage-consent-changed'));
    };

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '80px', // slightly above the footer
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                background: 'rgba(10, 10, 10, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '24px',
                width: '90%',
                maxWidth: '600px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text)',
            }}
            className="flex flex-col sm:flex-row items-center gap-6"
        >
            <div className="flex-1">
                <h3 className="text-sm font-bold mb-2 text-white" style={{ letterSpacing: '0.05em' }}>
                    Storage Consent Required
                </h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                    We use local browser storage to save your recent threat simulations so you can view them later. 
                    No data is sent to our servers. Do you accept the use of local storage?
                </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                <button
                    onClick={handleDecline}
                    style={{
                        padding: '10px 16px',
                        background: 'transparent',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flex: 1,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = '#555';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                >
                    Decline
                </button>
                <button
                    onClick={handleAccept}
                    style={{
                        padding: '10px 16px',
                        background: 'var(--color-accent)',
                        border: '1px solid var(--color-accent)',
                        color: '#000',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flex: 1,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e6002e';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-accent)';
                    }}
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
