import React from 'react';
import { TACTICS, TacticCell } from './LandingPage';

export default function Tactics() {
    const W = { maxWidth: '1400px', margin: '0 auto' };

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: '100px' }}>
            {/* Header */}
            <section style={{ borderBottom: '1px solid #111', paddingTop: '40px', paddingBottom: '40px' }}>
                <div style={{ ...W, padding: '0 32px' }}>
                    <div className="terminal-label" style={{ marginBottom: '24px' }}>MITRE ATT&CK FRAMEWORK</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '24px' }}>
                        Adversary Tactics <span style={{ color: '#ffaa00' }}>// GRID</span>
                    </h1>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#666', lineHeight: 1.6, maxWidth: '600px' }}>
                        Explore the granular breakdown of adversary behavior. These tactics categorize the "why" and "how" of cyber attacks, mapping directly to actionable detection engineering rules.
                    </p>
                </div>
            </section>

            {/* TACTICS GRID */}
            <section style={{ ...W, padding: '48px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#444' }}>
                        MITRE ATT&CK Framework Alignment
                    </p>
                    <a
                        href="/matrix.csv"
                        download="matrix.csv"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            color: '#555',
                            background: 'transparent',
                            border: '1px solid #2a2a2a',
                            padding: '5px 12px',
                            cursor: 'pointer',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: 'color 0.2s, border-color 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555'; }}
                    >
                        DOWNLOAD_MATRIX.CSV
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-[#1a1a1a]">
                    {TACTICS.map((tactic) => (
                        <div
                            key={tactic.id}
                            className="lg:border-r lg:border-b lg:border-[#1a1a1a] lg:p-8 [&:nth-child(3n)]:border-r-0 [&:nth-last-child(-n+3)]:border-b-0 py-6 lg:py-8"
                        >
                            <TacticCell tactic={tactic} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
