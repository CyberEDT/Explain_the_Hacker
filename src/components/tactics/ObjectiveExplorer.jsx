import React from 'react';
import { MITRE_TACTICS } from '../../data/tacticsData';

const OBJECTIVES = [
    { title: 'Gain Access', color: '#ff0033', desc: 'Breaching the perimeter and establishing initial execution.' },
    { title: 'Maintain Access', color: '#ffaa00', desc: 'Ensuring access survives reboots and avoiding detection.' },
    { title: 'Expand Access', color: '#00aaff', desc: 'Stealing credentials and moving laterally to new hosts.' },
    { title: 'Achieve Objective', color: '#00ff9d', desc: 'Collecting data, exfiltrating it, or destroying systems.' }
];

export default function ObjectiveExplorer() {
    return (
        <section style={{ padding: '80px 32px', background: '#000', borderBottom: '1px solid #111' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '48px' }}>
                    <div className="terminal-label" style={{ marginBottom: '16px' }}>ATTACKER MOTIVATIONS</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', color: '#fff', textTransform: 'uppercase' }}>
                        Objective Explorer
                    </h2>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#888', maxWidth: '600px', marginTop: '16px' }}>
                        Tactics do not exist in a vacuum. They are grouped by the adversary's overarching goals during a campaign.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {OBJECTIVES.map((obj) => {
                        const tactics = MITRE_TACTICS.filter(t => t.category === obj.title);
                        
                        return (
                            <div key={obj.title} style={{ display: 'flex', flexDirection: 'column' }}>
                                {/* Column Header */}
                                <div style={{ borderTop: `3px solid ${obj.color}`, paddingTop: '16px', marginBottom: '24px' }}>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        {obj.title}
                                    </h3>
                                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#666', lineHeight: 1.5 }}>
                                        {obj.desc}
                                    </p>
                                </div>

                                {/* Tactic Cards */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {tactics.map(tactic => (
                                        <div key={tactic.id} style={{ 
                                            background: '#0a0a0a', 
                                            border: '1px solid #1a1a1a', 
                                            padding: '16px',
                                            transition: 'border-color 0.2s',
                                            cursor: 'default'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#333'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1a1a1a'}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: obj.color }}>{tactic.id}</span>
                                            </div>
                                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>
                                                {tactic.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
