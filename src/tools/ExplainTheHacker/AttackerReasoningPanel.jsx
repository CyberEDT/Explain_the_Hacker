import React, { useState } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────
function Ico({ d, size = 16, strokeWidth = 2 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={strokeWidth}
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
        </svg>
    );
}

const ChevronDownIcon = () => <Ico d="m6 9 6 6 6-6" />;
const ChevronUpIcon = () => <Ico d="m18 15-6-6-6 6" />;
const BrainIcon = () => <Ico d={["M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z", "M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"]} size={20} />;

// Per-phase identity colors — same palette as ResultsPanel kill chain
const PHASE_COLORS = {
    'RECONNAISSANCE':        { accent: '#e8183a', glow: 'rgba(232,24,58,0.08)' },
    'WEAPONIZATION':         { accent: '#ff6b2b', glow: 'rgba(255,107,43,0.08)' },
    'DELIVERY':              { accent: '#ff2d7b', glow: 'rgba(255,45,123,0.08)' },
    'EXPLOITATION':          { accent: '#ffaa00', glow: 'rgba(255,170,0,0.08)' },
    'INSTALLATION':          { accent: '#00e5ff', glow: 'rgba(0,229,255,0.08)' },
    'COMMAND & CONTROL':     { accent: '#4db8ff', glow: 'rgba(77,184,255,0.08)' },
    'ACTIONS ON OBJECTIVES': { accent: '#00ff9d', glow: 'rgba(0,255,157,0.08)' },
};

export default function AttackerReasoningPanel({ killChain, intelligenceLevel }) {
    const [expanded, setExpanded] = useState(intelligenceLevel !== 'LOW');

    if (!killChain || killChain.length === 0) return null;

    // Show all phases that are NOT "NOT OBSERVED" — each one tells an attacker reasoning story
    const activePhases = killChain.filter(phase => phase.status !== 'NOT OBSERVED');

    if (activePhases.length === 0) return null;

    return (
        <div style={{ marginBottom: '56px' }}>
            {/* Header */}
            <div 
                onClick={() => setExpanded(!expanded)}
                style={{ 
                    padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#0a0a0a', border: '1px solid #1a1a1a', borderBottom: expanded ? '1px solid #1a1a1a' : '1px solid #1a1a1a',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#00aaff' }}><BrainIcon /></span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>
                        Attacker Reasoning
                    </h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#444', letterSpacing: '0.1em', marginLeft: '8px' }}>
                        EVIDENCE-ANCHORED WHAT-IF ANALYSIS
                    </span>
                </div>
                <span style={{ color: '#666' }}>{expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
            </div>

            {expanded && (
                <div style={{ background: '#050505', border: '1px solid #1a1a1a', borderTop: 'none', padding: '24px' }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
                        How a real attacker thinks through each stage — anchored <em>only</em> to observed and inferred evidence from this environment.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {activePhases.map((phase, idx) => {
                            const pc = PHASE_COLORS[phase.phase?.toUpperCase()] || { accent: '#888', glow: 'rgba(255,255,255,0.05)' };
                            return (
                                <div key={idx} style={{
                                    display: 'grid', gridTemplateColumns: '200px 1fr', gap: '0',
                                    background: '#0a0a0a', borderLeft: `3px solid ${pc.accent}`,
                                }}>
                                    {/* Phase label */}
                                    <div style={{ padding: '16px 20px', background: pc.glow, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: pc.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                            {phase.phase}
                                        </span>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                                            color: phase.status === 'OBSERVED' ? '#ff4d6a' : phase.status === 'INFERRED' ? '#ffbf40' : '#4dc3ff',
                                            letterSpacing: '0.1em',
                                        }}>
                                            {phase.status}
                                        </span>
                                    </div>

                                    {/* Reasoning content */}
                                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #111' }}>
                                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#ccc', lineHeight: 1.6, margin: 0, marginBottom: phase.supportingEvidence?.length > 0 ? '10px' : 0 }}>
                                            {phase.explanation}
                                        </p>
                                        
                                        {phase.supportingEvidence?.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                                {phase.supportingEvidence.filter(Boolean).map((ev, i) => (
                                                    <span key={i} style={{
                                                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                                                        color: '#888', background: 'rgba(255,255,255,0.04)',
                                                        border: '1px solid #222', padding: '3px 8px',
                                                    }}>
                                                        {ev}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
