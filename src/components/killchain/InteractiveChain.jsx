import React, { useState } from 'react';
import { KILL_CHAIN_STAGES } from '../../data/killChainDetailedData';

export default function InteractiveChain() {
    const [activeStage, setActiveStage] = useState(KILL_CHAIN_STAGES[0]);

    return (
        <section style={{ padding: '80px 32px', background: '#0a0a0a' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div className="terminal-label" style={{ marginBottom: '48px', color: '#888' }}>INTERACTIVE KILL CHAIN</div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: The Chain Navigation */}
                    <div style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {KILL_CHAIN_STAGES.map((stage, i) => {
                            const isActive = activeStage.id === stage.id;
                            const isPast = KILL_CHAIN_STAGES.findIndex(s => s.id === activeStage.id) > i;
                            
                            return (
                                <div 
                                    key={stage.id}
                                    onClick={() => setActiveStage(stage)}
                                    style={{
                                        padding: '20px 24px',
                                        background: isActive ? '#111' : 'transparent',
                                        border: `1px solid ${isActive ? stage.color : '#222'}`,
                                        borderLeft: `4px solid ${isActive ? stage.color : (isPast ? '#00aaff' : '#333')}`,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'all 0.3s ease',
                                        transform: isActive ? 'translateX(8px)' : 'translateX(0)'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.currentTarget.style.background = '#111';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <span style={{ 
                                        fontFamily: 'var(--font-mono)', 
                                        color: isActive ? stage.color : '#666',
                                        marginRight: '16px',
                                        fontSize: '0.9rem'
                                    }}>
                                        {stage.num}
                                    </span>
                                    <span style={{ 
                                        fontFamily: 'var(--font-display)', 
                                        color: isActive ? '#fff' : '#888',
                                        fontSize: '1.1rem',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {stage.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Stage Deep Dive */}
                    <div style={{ 
                        flex: 1, 
                        background: '#050505', 
                        border: '1px solid #1a1a1a', 
                        padding: '48px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '24px' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', color: activeStage.color, marginBottom: '8px' }}>
                                STAGE {activeStage.num}
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#fff', textTransform: 'uppercase', lineHeight: 1 }}>
                                {activeStage.title}
                            </h2>
                        </div>

                        {/* Attacker Question & Mindset */}
                        <div>
                            <div className="terminal-label" style={{ marginBottom: '16px' }}>ATTACKER MINDSET</div>
                            <div style={{ padding: '24px', background: '#111', borderLeft: `3px solid ${activeStage.color}` }}>
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#fff', marginBottom: '12px' }}>
                                    "{activeStage.attackerQuestion}"
                                </p>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#aaa', lineHeight: 1.6 }}>
                                    {activeStage.mindset}
                                </p>
                            </div>
                        </div>

                        {/* Two Column Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Activities */}
                            <div>
                                <div className="terminal-label" style={{ marginBottom: '16px' }}>TYPICAL ACTIVITIES</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {activeStage.activities.map((act, i) => (
                                        <li key={i} style={{ 
                                            fontFamily: 'var(--font-sans)', 
                                            color: '#ccc', 
                                            display: 'flex', 
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            fontSize: '0.95rem'
                                        }}>
                                            <span style={{ color: activeStage.color, marginTop: '2px' }}>▹</span>
                                            {act}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Outcomes */}
                            <div>
                                <div className="terminal-label" style={{ marginBottom: '16px' }}>EXPECTED OUTCOME</div>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#ccc', lineHeight: 1.6 }}>
                                    {activeStage.outcomes}
                                </p>
                            </div>
                        </div>

                        {/* Decorative background element representing animation */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: '-50px', 
                            right: '-50px', 
                            width: '300px', 
                            height: '300px', 
                            background: `radial-gradient(circle, ${activeStage.color}15 0%, transparent 70%)`,
                            zIndex: 0,
                            pointerEvents: 'none'
                        }} />
                    </div>
                </div>
            </div>
        </section>
    );
}
