import React, { useState } from 'react';
import { MITRE_TACTICS } from '../../data/tacticsData';
import { X, ChevronRight, Activity, ShieldAlert, Key } from 'lucide-react';

export default function TacticsGrid() {
    const [selectedTactic, setSelectedTactic] = useState(null);

    return (
        <section style={{ padding: '80px 32px', background: '#050505', position: 'relative' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <div className="terminal-label" style={{ marginBottom: '16px' }}>INTERACTIVE MATRIX</div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', color: '#fff', textTransform: 'uppercase' }}>
                            Enterprise Tactics
                        </h2>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#666' }}>
                        14 Active Tactics
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {MITRE_TACTICS.map((tactic) => (
                        <div 
                            key={tactic.id}
                            onClick={() => setSelectedTactic(tactic)}
                            style={{ 
                                background: '#0a0a0a', 
                                border: '1px solid #1a1a1a', 
                                padding: '24px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#444';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#1a1a1a';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#888' }}>{tactic.id}</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#ff0033', border: '1px solid #ff0033', padding: '2px 6px', borderRadius: '2px' }}>
                                    {tactic.techniqueCount} Techs
                                </span>
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#fff', marginBottom: '8px', letterSpacing: '0.02em' }}>
                                {tactic.name}
                            </h3>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#666', lineHeight: 1.5, flex: 1 }}>
                                {tactic.objective}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px', color: '#00aaff', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                DEEP DIVE <ChevronRight size={14} style={{ marginLeft: '4px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Side Drawer */}
            <TacticDrawer 
                tactic={selectedTactic} 
                onClose={() => setSelectedTactic(null)} 
            />
        </section>
    );
}

function TacticDrawer({ tactic, onClose }) {
    if (!tactic) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, right: 0, bottom: 0,
            width: '100%',
            maxWidth: '600px',
            background: '#050505',
            borderLeft: '1px solid #2a2a2a',
            zIndex: 100,
            boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.3s forwards'
        }}>
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
            
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ff0033', letterSpacing: '0.1em' }}>{tactic.id}</span>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#fff', margin: '4px 0' }}>{tactic.name}</h2>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#888' }}>{tactic.category}</p>
                </div>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px' }}>
                    <X size={24} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '32px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Attacker Mindset */}
                <div>
                    <div className="terminal-label" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={14} color="#ffaa00" /> ATTACKER MINDSET
                    </div>
                    <div style={{ padding: '20px', background: '#0a0a0a', borderLeft: '3px solid #ffaa00' }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#fff', fontStyle: 'italic', lineHeight: 1.6 }}>
                            "{tactic.mindset}"
                        </p>
                    </div>
                </div>

                {/* MITRE Objective */}
                <div>
                    <div className="terminal-label" style={{ marginBottom: '16px' }}>MITRE OBJECTIVE</div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#aaa', lineHeight: 1.6 }}>
                        {tactic.objective}
                    </p>
                </div>

                {/* Top Techniques */}
                <div>
                    <div className="terminal-label" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Key size={14} color="#00aaff" /> TOP TECHNIQUES
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {tactic.topTechniques.map((tech, i) => (
                            <span key={i} style={{ 
                                background: '#111', border: '1px solid #222', padding: '6px 12px', 
                                fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ccc' 
                            }}>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ETH Perspective */}
                <div>
                    <div className="terminal-label" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldAlert size={14} color="#ff0033" /> ETH PERSPECTIVE
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#ccc', lineHeight: 1.6 }}>
                        {tactic.ethPerspective}
                    </p>
                </div>

                {/* Meta Stats */}
                <div style={{ display: 'flex', gap: '24px', paddingTop: '24px', borderTop: '1px solid #1a1a1a' }}>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#666', marginBottom: '4px' }}>TECHNIQUES</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: '#fff' }}>{tactic.techniqueCount}</div>
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#666', marginBottom: '4px' }}>DIFFICULTY</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: '#ffaa00' }}>{tactic.difficulty}</div>
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#666', marginBottom: '4px' }}>ATTACKER VALUE</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: '#ff0033' }}>{tactic.attackerValue}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
