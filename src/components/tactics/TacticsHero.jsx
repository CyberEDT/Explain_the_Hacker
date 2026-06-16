import React from 'react';


export default function TacticsHero() {
    return (
        <section style={{ 
            position: 'relative', 
            borderBottom: '1px solid #111', 
            paddingTop: '80px', 
            paddingBottom: '80px',
            overflow: 'hidden',
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center'
        }}>
            {/* Animated SVG Background */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
                            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#333" strokeWidth="0.05"/>
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                    <circle cx="20" cy="30" r="0.5" fill="#ff0033" />
                    <circle cx="50" cy="60" r="0.5" fill="#ffaa00" />
                    <circle cx="80" cy="40" r="0.5" fill="#00ff9d" />
                    <path d="M 20 30 L 50 60 L 80 40" fill="none" stroke="#ffaa00" strokeWidth="0.2" strokeDasharray="1 1" />
                </svg>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1, width: '100%' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                    <div className="terminal-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         MITRE ATT&CK EXPERIENCE
                    </div>
                </div>

                <h1 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: 'clamp(40px, 8vw, 100px)', 
                    lineHeight: 0.9, 
                    textTransform: 'uppercase', 
                    marginBottom: '24px',
                    color: '#fff',
                    wordBreak: 'break-word'
                }}>
                    UNDERSTANDING<br />
                    ATTACKER<br />
                    <span style={{ color: '#ff0033' }}>TACTICS</span>
                </h1>
                
                <p style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '1rem', 
                    color: '#888', 
                    lineHeight: 1.6, 
                    maxWidth: '600px',
                    marginBottom: '32px'
                }}>
                    Explore the goals, objectives, and behaviors that drive modern cyber attacks. Every technique serves a purpose. Every tactic serves an objective.
                </p>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ borderLeft: '2px solid #ff0033', paddingLeft: '16px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#fff', fontWeight: 'bold' }}>14</div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Enterprise Tactics</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #ffaa00', paddingLeft: '16px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#fff', fontWeight: 'bold' }}>200+</div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Techniques Mapping</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #00ff9d', paddingLeft: '16px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#fff', fontWeight: 'bold' }}>APT</div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Adversary Behavior</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
