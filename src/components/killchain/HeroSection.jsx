import React, { useState, useEffect } from 'react';
import { KILL_CHAIN_STAGES } from '../../data/killChainDetailedData';

export default function HeroSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % KILL_CHAIN_STAGES.length);
        }, 3000); // Progress every 3 seconds for the hero loop
        return () => clearInterval(interval);
    }, []);

    return (
        <section style={{ 
            padding: '80px 32px', 
            background: '#050505', 
            borderBottom: '1px solid #1a1a1a',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                
                {/* Text Content */}
                <div style={{ zIndex: 10 }}>
                    <div className="terminal-label" style={{ marginBottom: '24px', color: '#ff0033' }}>
                        THE CYBER KILL CHAIN
                    </div>
                    <h1 style={{ 
                        fontFamily: 'var(--font-display)', 
                        fontSize: 'clamp(48px, 8vw, 96px)', 
                        lineHeight: 0.9, 
                        textTransform: 'uppercase', 
                        color: '#fff',
                        marginBottom: '24px',
                        letterSpacing: '-0.02em'
                    }}>
                        Visualizing<br />
                        The Kill<br />
                        <span style={{ color: '#00aaff' }}>Chain</span>
                    </h1>
                    <p style={{ 
                        fontFamily: 'var(--font-sans)', 
                        fontSize: '1.25rem', 
                        color: '#888', 
                        maxWidth: '600px',
                        lineHeight: 1.6 
                    }}>
                        Understand how attackers move from reconnaissance to impact through every stage of a cyber attack.
                    </p>
                </div>

                {/* Hero Animation: Sequential Light-up */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    gap: '12px',
                    alignItems: 'center',
                    marginTop: '24px',
                    overflowX: 'auto',
                    paddingBottom: '24px'
                }}>
                    {KILL_CHAIN_STAGES.map((stage, i) => {
                        const isActive = i === activeIndex;
                        const isPast = i < activeIndex;
                        return (
                            <React.Fragment key={stage.id}>
                                <div style={{
                                    flexShrink: 0,
                                    padding: '16px 24px',
                                    background: isActive ? 'rgba(0, 170, 255, 0.1)' : (isPast ? '#111' : '#0a0a0a'),
                                    border: `1px solid ${isActive ? stage.color : '#222'}`,
                                    borderRadius: '4px',
                                    color: isActive ? '#fff' : '#666',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.5s ease',
                                    boxShadow: isActive ? `0 0 20px ${stage.color}40` : 'none',
                                    transform: isActive ? 'translateY(-4px)' : 'translateY(0)'
                                }}>
                                    <span style={{ color: isActive ? stage.color : '#444', marginRight: '8px' }}>{stage.num}</span>
                                    {stage.title}
                                </div>
                                {i < KILL_CHAIN_STAGES.length - 1 && (
                                    <div style={{
                                        flexShrink: 0,
                                        width: '40px',
                                        height: '2px',
                                        background: isActive || isPast ? '#00aaff' : '#222',
                                        opacity: isActive || isPast ? 1 : 0.3,
                                        transition: 'background 0.5s ease'
                                    }} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
