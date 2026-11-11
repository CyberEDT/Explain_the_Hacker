import React, { useState } from 'react';

const T = {
    red:    '#ff0033',
    amber:  '#ffaa00',
    blue:   '#00aaff',
    green:  '#00ff9d',
    white:  '#ffffff',
    bg:     '#000000',
    s1:     '#0a0a0a',
    s2:     '#111111',
    s3:     '#1a1a1a',
    border: '#1f1f1f',
    b2:     '#2a2a2a',
    muted:  '#666666',
    mono:   'var(--font-mono)',
    sans:   'var(--font-sans)',
    disp:   'var(--font-display)',
};

const TIER_COLOR = {
    beginner: T.green,
    intermediate: T.amber,
    advanced: T.red,
};

function TerminalViewer({ steps }) {
    if (!steps || steps.length === 0) return null;
    return (
        <div style={{
            background: '#050505',
            border: `1px solid ${T.b2}`,
            padding: '14px 16px',
            fontFamily: T.mono,
            fontSize: '0.75rem',
            lineHeight: 1.6,
            borderRadius: '2px',
            marginTop: '10px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', borderBottom: `1px solid ${T.border}`, paddingBottom: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ color: T.muted, fontSize: '0.65rem', marginLeft: '6px' }}>ATTACKER PROOF OF CONCEPT TERMINAL</span>
            </div>
            {steps.map((st, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                    {st.annotation && (
                        <div style={{ color: '#00aaff', fontSize: '0.68rem', opacity: 0.9 }}>
                            {st.annotation.startsWith('//') ? st.annotation : `// ${st.annotation}`}
                        </div>
                    )}
                    {st.type === 'command' && (
                        <div style={{ color: T.green, display: 'flex', gap: '8px' }}>
                            <span style={{ color: T.red }}>$</span>
                            <span>{st.content}</span>
                        </div>
                    )}
                    {st.type === 'output' && (
                        <pre style={{
                            margin: '4px 0 0 16px',
                            color: '#ccc',
                            whiteSpace: 'pre-wrap',
                            fontFamily: T.mono,
                            fontSize: '0.72rem'
                        }}>
                            {st.content}
                        </pre>
                    )}
                    {st.type === 'annotation' && (
                        <div style={{ color: T.amber, fontSize: '0.7rem', fontStyle: 'italic', margin: '4px 0 0 16px' }}>
                            {st.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function MatchedCombinationsSection({ combinations, intelligenceLevel }) {
    const [expandedIds, setExpandedIds] = useState(() => new Set(combinations?.map(c => c.id) || []));

    if (!combinations || combinations.length === 0) return null;

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                <h3 style={{
                    fontFamily: T.disp,
                    fontSize: '1.6rem',
                    color: T.white,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    margin: 0
                }}>
                    Matched Attack Combination Intelligence
                </h3>
                <span style={{
                    fontFamily: T.mono,
                    fontSize: '0.65rem',
                    color: T.red,
                    background: 'rgba(255, 0, 51, 0.1)',
                    border: '1px solid rgba(255, 0, 51, 0.3)',
                    padding: '2px 8px',
                    fontWeight: 700
                }}>
                    {combinations.length} CORRELATED {combinations.length === 1 ? 'PATH' : 'PATHS'}
                </span>
            </div>

            <p style={{
                fontFamily: T.mono,
                fontSize: '0.65rem',
                color: '#666',
                marginBottom: '20px',
                letterSpacing: '0.04em'
            }}>
                Identified multi-vector attack scenarios directly correlated from ETH's Attack Library based on your active services and misconfigurations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {combinations.map(combo => {
                    const isExpanded = expandedIds.has(combo.id);
                    const tierColor = TIER_COLOR[combo.tier] || T.amber;

                    return (
                        <div
                            key={combo.id}
                            style={{
                                background: T.s1,
                                border: `1px solid ${T.b2}`,
                                borderLeft: `4px solid ${tierColor}`,
                                padding: '20px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {/* Card Header */}
                            <div
                                onClick={() => toggleExpand(combo.id)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    cursor: 'pointer',
                                    gap: '16px'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <span style={{
                                            fontFamily: T.mono,
                                            fontSize: '0.55rem',
                                            fontWeight: 700,
                                            color: tierColor,
                                            border: `1px solid ${tierColor}44`,
                                            padding: '2px 6px',
                                            textTransform: 'uppercase'
                                        }}>
                                            {combo.tier}
                                        </span>
                                        <span style={{ fontFamily: T.mono, fontSize: '0.6rem', color: T.muted }}>
                                            {combo.id}
                                        </span>
                                        <span style={{
                                            fontFamily: T.mono,
                                            fontSize: '0.6rem',
                                            color: '#00aaff',
                                            background: 'rgba(0,170,255,0.1)',
                                            padding: '2px 6px'
                                        }}>
                                            PORT {combo.port} • {combo.service}
                                        </span>
                                    </div>

                                    <h4 style={{
                                        fontFamily: T.sans,
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        color: T.white,
                                        margin: '0 0 6px 0'
                                    }}>
                                        {combo.name}
                                    </h4>

                                    <p style={{
                                        fontFamily: T.sans,
                                        fontSize: '0.85rem',
                                        color: T.amber,
                                        margin: 0,
                                        lineHeight: 1.5
                                    }}>
                                        {combo.tagline}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontFamily: T.mono, fontSize: '0.55rem', color: T.muted, textTransform: 'uppercase' }}>
                                            EXPLOITABILITY
                                        </div>
                                        <div style={{ fontFamily: T.mono, fontSize: '1rem', fontWeight: 700, color: T.red }}>
                                            {combo.interestScore || 90}%
                                        </div>
                                    </div>
                                    <span style={{
                                        fontFamily: T.mono,
                                        fontSize: '0.9rem',
                                        color: T.muted,
                                        padding: '4px 8px',
                                        border: `1px solid ${T.border}`
                                    }}>
                                        {isExpanded ? '▴' : '▾'}
                                    </span>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div style={{ marginTop: '20px', borderTop: `1px solid ${T.border}`, paddingTop: '16px' }}>
                                    {/* Overview & Why Attackers Care */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', border: `1px solid ${T.border}` }}>
                                            <h5 style={{ fontFamily: T.mono, fontSize: '0.65rem', color: '#00aaff', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                                                ATTACK SCENARIO OVERVIEW
                                            </h5>
                                            <p style={{ fontFamily: T.sans, fontSize: '0.82rem', color: '#ccc', lineHeight: 1.6, margin: 0 }}>
                                                {combo.overview}
                                            </p>
                                        </div>

                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', border: `1px solid ${T.border}` }}>
                                            <h5 style={{ fontFamily: T.mono, fontSize: '0.65rem', color: T.red, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                                                WHY ATTACKERS CARE
                                            </h5>
                                            <p style={{ fontFamily: T.sans, fontSize: '0.82rem', color: '#ccc', lineHeight: 1.6, margin: 0 }}>
                                                {combo.whyAttackersCare}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Attacker Terminal Walkthrough */}
                                    {combo.terminal && combo.terminal.length > 0 && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <h5 style={{ fontFamily: T.mono, fontSize: '0.65rem', color: T.green, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                                                PRACTICAL ATTACK EXECUTION PROOF-OF-CONCEPT
                                            </h5>
                                            <TerminalViewer steps={combo.terminal} />
                                        </div>
                                    )}

                                    {/* Real World Threat History */}
                                    {combo.realWorld && (
                                        <div style={{ background: 'rgba(255, 170, 0, 0.05)', borderLeft: `3px solid ${T.amber}`, padding: '12px 16px', marginBottom: '16px' }}>
                                            <span style={{ fontFamily: T.mono, fontSize: '0.65rem', color: T.amber, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                                                REAL-WORLD ACTOR USAGE & THREAT TELEMETRY
                                            </span>
                                            <p style={{ fontFamily: T.sans, fontSize: '0.8rem', color: '#bbb', margin: 0, lineHeight: 1.5 }}>
                                                {combo.realWorld}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actionable Defender Remediation Steps */}
                                    {combo.defenderSteps && combo.defenderSteps.length > 0 && (
                                        <div style={{ background: 'rgba(0, 255, 157, 0.03)', border: `1px solid rgba(0, 255, 157, 0.2)`, padding: '14px 16px' }}>
                                            <h5 style={{ fontFamily: T.mono, fontSize: '0.65rem', color: T.green, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                                                ACTIONABLE DEFENDER MITIGATION PATH
                                            </h5>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {combo.defenderSteps.map((step, sIdx) => {
                                                    const prioColor = step.priority === 'critical' ? T.red : step.priority === 'high' ? T.amber : '#00aaff';
                                                    return (
                                                        <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                            <span style={{
                                                                fontFamily: T.mono,
                                                                fontSize: '0.55rem',
                                                                fontWeight: 700,
                                                                color: prioColor,
                                                                border: `1px solid ${prioColor}44`,
                                                                padding: '1px 6px',
                                                                textTransform: 'uppercase',
                                                                flexShrink: 0,
                                                                marginTop: '2px'
                                                            }}>
                                                                {step.priority}
                                                            </span>
                                                            <span style={{ fontFamily: T.sans, fontSize: '0.8rem', color: '#ccc', lineHeight: 1.5 }}>
                                                                {step.action}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
