import React, { useState } from 'react';

/**
 * ChartExplainer
 * A reusable wrapper for charts that provides a collapsible explanation section.
 * Designed to match the dark, premium aesthetic of the Explain the Hacker platform.
 */
export default function ChartExplainer({ title, explanation, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            marginBottom: '24px'
        }}>
            {/* The actual chart */}
            <div style={{ position: 'relative', width: '100%' }}>
                {children}
            </div>

            {/* The explainer toggle */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '4px'
            }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: isOpen ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        transition: 'color 0.2s ease',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
                    onMouseLeave={(e) => e.target.style.color = isOpen ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
                >
                    <span style={{ 
                        display: 'inline-block', 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                    }}>
                        ▼
                    </span>
                    {isOpen ? 'Close Explanation' : 'How to read this chart'}
                </button>
            </div>

            {/* The explainer content */}
            {isOpen && (
                <div style={{
                    padding: '16px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderLeft: '2px solid var(--color-accent)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    animation: 'fadeInDown 0.2s ease-out forwards',
                    transformOrigin: 'top'
                }}>
                    {title && (
                        <div style={{ 
                            color: 'var(--color-text-primary)', 
                            marginBottom: '8px', 
                            fontFamily: 'var(--font-disp)',
                            fontWeight: '600'
                        }}>
                            {title}
                        </div>
                    )}
                    <div>
                        {explanation}
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
