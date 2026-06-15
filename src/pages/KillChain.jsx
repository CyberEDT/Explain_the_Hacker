import React, { useState, useEffect, useRef } from 'react';
import { ATTACK_PHASES, PhaseCard } from './LandingPage';

export default function KillChain() {
    const W = { maxWidth: '1400px', margin: '0 auto' };
    const [activePhase, setActivePhase] = useState(3);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setActivePhase(prev => (prev + 1) % ATTACK_PHASES.length);
        }, 3000);
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: '100px' }}>
            {/* Header */}
            <section style={{ borderBottom: '1px solid #111', paddingTop: '40px', paddingBottom: '40px' }}>
                <div style={{ ...W, padding: '0 32px' }}>
                    <div className="terminal-label" style={{ marginBottom: '24px' }}>CYBER KILL CHAIN</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '24px' }}>
                        Threat Architecture <span style={{ color: '#00aaff' }}>// EXPLORER</span>
                    </h1>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#666', lineHeight: 1.6, maxWidth: '600px' }}>
                        The 7-phase model of an Advanced Persistent Threat (APT). Understand the attacker's methodology from initial reconnaissance to the ultimate actions on objectives.
                    </p>
                </div>
            </section>

            {/* LIVE ATTACK CHAIN VISUALIZATION */}
            <section style={{ ...W, padding: '48px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div className="terminal-label">LIVE ATTACK CHAIN VISUALIZATION</div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#333', letterSpacing: '0.08em' }}>
                        Scenario: Advanced Persistent Threat (APT-41)
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-y-4 lg:gap-y-0 items-stretch">
                    {ATTACK_PHASES.map((phase, i) => (
                        <div
                            key={phase.num}
                            className="flex lg:border-r lg:border-[#1a1a1a] lg:pr-5 lg:pl-5 first:pl-0 last:pr-0 last:border-r-0"
                            style={{ opacity: activePhase === i ? 1 : 0.6, transition: 'opacity 0.3s' }}
                        >
                            <PhaseCard phase={phase} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
