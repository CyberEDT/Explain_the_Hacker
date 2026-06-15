/**
 * ResultsPanel.jsx
 * Matches reference site result panel design.
 * Security: Zero dangerouslySetInnerHTML. All text via React nodes.
 */
import { useState, useEffect, useCallback, useRef } from 'react';

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
const RefreshIcon = () => <Ico d={['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8','M21 3v5h-5','M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16','M8 16H3v5']} />;
const CheckIcon  = () => <Ico d="M20 6 9 17l-5-5" strokeWidth={2.5} />;
const PlusIcon   = () => <Ico d={['M12 5v14','M5 12h14']} size={14}/>;
const MinusIcon  = () => <Ico d="M5 12h14" size={14}/>;
const ShieldIcon = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" size={14}/>;
const EyeIcon    = () => <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0" size={13}/>;

// ─── Evidence Classification Badge ───────────────────────────────────────────
// OBSERVED = green (confirmed from data)
// INFERRED = amber (statistically likely based on TTPs)
// POTENTIAL = blue (worst-case hypothesis, not confirmed)
function EvidenceBadge({ type, small = false }) {
    const t = type?.toLowerCase();
    const cfg = {
        observed:    { label: 'OBSERVED',  bg: 'rgba(0,255,157,0.1)',  border: 'rgba(0,255,157,0.35)',  color: '#00ff9d' },
        inferred:    { label: 'INFERRED',  bg: 'rgba(255,170,0,0.08)', border: 'rgba(255,170,0,0.35)',  color: '#ffaa00' },
        hypothetical:{ label: 'POTENTIAL', bg: 'rgba(0,170,255,0.08)', border: 'rgba(0,170,255,0.3)',   color: '#00aaff' },
    }[t] || { label: 'INFERRED', bg: 'rgba(255,170,0,0.08)', border: 'rgba(255,170,0,0.35)', color: '#ffaa00' };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: small ? '0.5rem' : '0.55rem',
            fontWeight: 700, letterSpacing: '0.1em',
            padding: small ? '2px 5px' : '2px 7px',
            background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
            flexShrink: 0,
        }}>
            {cfg.label}
        </span>
    );
}

// ─── Severity helpers ─────────────────────────────────────────────────────────
function severityColor(level) {
    const l = level?.toLowerCase();
    if (l === 'critical') return { bg: '#e8183a', text: '#fff' };
    if (l === 'high')     return { bg: '#ffaa00', text: '#000' };
    if (l === 'medium')   return { bg: '#00aaff', text: '#000' };
    return                       { bg: '#00ff9d', text: '#000' };
}

function riskMeta(score) {
    if (score >= 80) return { label: 'CRITICAL RISK', color: '#e8183a' };
    if (score >= 60) return { label: 'HIGH RISK',     color: '#ffaa00' };
    if (score >= 40) return { label: 'MEDIUM RISK',   color: '#00aaff' };
    return                  { label: 'LOW RISK',       color: '#00ff9d' };
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text, id, label = 'COPY', fullWidth = false }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);
    const handle = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(String(text));
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }, [text]);
    return (
        <button type="button" id={id} onClick={handle}
            style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                color: copied ? '#00ff9d' : '#888', letterSpacing: '0.1em',
                padding: '10px 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                width: fullWidth ? '100%' : 'auto',
                transition: 'color 0.15s',
            }}
            onMouseEnter={e => { if (!copied) e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { if (!copied) e.currentTarget.style.color = '#888'; }}
        >
            {copied ? <CheckIcon /> : label}
        </button>
    );
}

// ─── Risk Gauge ───────────────────────────────────────────────────────────────
function RiskGauge({ score }) {
    const meta = riskMeta(score);
    const R = 52, C = 2 * Math.PI * R;
    const [animated, setAnimated] = useState(0);
    useEffect(() => { const t = setTimeout(() => setAnimated(score), 80); return () => clearTimeout(t); }, [score]);
    const filled = (animated / 100) * C;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 148 }}>
            <div style={{ position: 'relative', width: 140, height: 140 }}>
                <svg width="140" height="140" viewBox="0 0 130 130" aria-label={`Risk ${score}/100`}>
                    <circle cx="65" cy="65" r={R} fill="none" stroke="#1a1a1a" strokeWidth="12" />
                    <circle cx="65" cy="65" r={R} fill="none"
                        stroke={meta.color} strokeWidth="12" strokeLinecap="round"
                        strokeDasharray={`${filled} ${C - filled}`}
                        strokeDashoffset={C * 0.25}
                        style={{ transition: 'stroke-dasharray 1.2s ease-out' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: meta.color, lineHeight: 1 }}>
                        {score}<span style={{ fontSize: '0.9rem', color: '#444', marginLeft: '2px' }}>/100</span>
                    </span>
                </div>
            </div>
            {/* Reference: badge below gauge — matching severity bg color */}
            <span style={{
                marginTop: '14px', padding: '4px 14px',
                background: meta.color, color: meta.color === '#e8183a' ? '#fff' : '#000',
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em',
            }}>
                {meta.label}
            </span>
        </div>
    );
}

// ─── Stats Cell ───────────────────────────────────────────────────────────────
// Reference pattern: gap-px bg-border grid, each cell bg-background
function StatCell({ value, label, color = '#e8183a' }) {
    return (
        <div style={{ background: '#000', padding: '16px 20px' }}>
            <p style={{
                fontFamily: 'var(--font-display)', fontSize: '2rem',
                color, margin: 0, lineHeight: 1,
            }}>{value}</p>
            <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                color: '#555', letterSpacing: '0.15em', marginTop: '6px', textTransform: 'uppercase',
            }}>{label}</p>
        </div>
    );
}

// ─── Top Summary Bar ──────────────────────────────────────────────────────────
function TopSummaryBar({ result, onNewAnalysis }) {
    const date = new Date(result.timestamp).toLocaleString();
    const report = useCallback(() => JSON.stringify(result, null, 2), [result]);

    return (
        <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
                {/* Left: Gauge + title + stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                    <RiskGauge score={result.riskScore} />

                    <div style={{ flex: 1, minWidth: '200px' }}>
                        {/* Reference: font-extrabold uppercase tracking-tighter style heading */}
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                            color: '#fff', margin: 0, marginBottom: '4px', lineHeight: 1.05,
                            textTransform: 'uppercase', letterSpacing: '-0.02em',
                        }}>
                            EXPOSURE ASSESSMENT COMPLETE
                        </h2>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', letterSpacing: '0.1em', marginBottom: '20px' }}>
                            ID: {result.id} • {date}
                        </p>

                        {/* Stats grid — reference: grid gap-px bg-border */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1a1a] w-fit">
                            <StatCell value={result.attackChain.length} label="Attack Phases" />
                            <StatCell value={result.iocList.length}     label="IOCs Found" />
                            <StatCell value={result.mitigations.length} label="Mitigations" />
                            <StatCell value={`${result.confidenceScore}%`} label="Confidence" />
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a1a1a', minWidth: '200px' }}>
                    {/* Reference: bg-foreground text-background font-mono ... hover:bg-accent */}
                    <button
                        onClick={onNewAnalysis}
                        id="new-analysis-btn"
                        style={{
                            background: '#fff', color: '#000', border: 'none',
                            fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            padding: '14px 20px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            width: '100%', transition: 'background 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#e8183a'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                    >
                        <RefreshIcon /> New Analysis
                    </button>

                    {/* Export row */}
                    <div style={{ display: 'flex', gap: '1px', background: '#1a1a1a' }}>
                        <div style={{ flex: 1, background: '#000', textAlign: 'center' }}>
                            <CopyButton id="copy-report-btn" text={report()} label="COPY" fullWidth />
                        </div>
                        <div style={{ flex: 1, background: '#000', textAlign: 'center' }}>
                            <CopyButton id="copy-txt-btn"    text={result.summary} label="TXT" fullWidth />
                        </div>
                        <div style={{ flex: 1, background: '#000', textAlign: 'center' }}>
                            <CopyButton id="copy-json-btn"   text={report()} label="JSON" fullWidth />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Framework Warning Banner ─────────────────────────────────────────────────
// Renders structured warnings from the Unknown Port Handling Framework.
// Appears only when unknownPorts or unmatchedMisconfigs exist in the result.
function FrameworkWarningBanner({ frameworkWarnings, portIntelStatus }) {
    if (!frameworkWarnings?.length && !portIntelStatus?.hasUnknownEntities) return null;

    const { unknownPorts = [], unmatchedMisconfigs = [], allPortsUnknown = false } = portIntelStatus || {};

    // Pick an icon path based on warning category
    const iconInfo = 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v4m0 4h.01';

    const warnType = (msg) => {
        if (msg.includes('Insufficient information')) return { border: '#e8183a', bg: 'rgba(232,24,58,0.06)', tag: 'NO ANALYSIS', tagColor: '#e8183a' };
        if (msg.includes('not found in ETH knowledge base')) return { border: '#ffaa00', bg: 'rgba(255,170,0,0.05)', tag: 'UNKNOWN PORT', tagColor: '#ffaa00' };
        if (msg.includes('not recognized in ETH knowledge base')) return { border: '#ff8c00', bg: 'rgba(255,140,0,0.05)', tag: 'UNKNOWN MISCONFIG', tagColor: '#ff8c00' };
        if (msg.includes('Non-standard port')) return { border: '#00aaff', bg: 'rgba(0,170,255,0.05)', tag: 'SERVICE-DRIVEN', tagColor: '#00aaff' };
        return { border: '#555', bg: 'rgba(255,255,255,0.02)', tag: 'NOTE', tagColor: '#555' };
    };

    return (
        <div style={{ marginBottom: '32px' }}>
            {/* Section header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '12px',
            }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="#ffaa00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={iconInfo} />
                </svg>
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                    color: '#ffaa00', letterSpacing: '0.18em', fontWeight: 700,
                    textTransform: 'uppercase',
                }}>
                    ETH Knowledge Base Status · {frameworkWarnings.length} Advisory{frameworkWarnings.length !== 1 ? 'ies' : ''}
                </span>
            </div>

            {/* Confidence impact strip — only when all ports are unknown */}
            {allPortsUnknown && (
                <div style={{
                    background: 'rgba(232,24,58,0.08)',
                    borderLeft: '3px solid #e8183a',
                    padding: '10px 16px',
                    marginBottom: '8px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                    <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                        color: '#e8183a', fontWeight: 700, letterSpacing: '0.14em',
                        flexShrink: 0,
                    }}>ANALYSIS LIMITED</span>
                    <span style={{
                        fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#888',
                    }}>
                        All submitted ports are outside the ETH knowledge base.
                        Attacker intelligence cannot be fabricated — results are limited to generic network exposure risks.
                        Provide a known port (e.g.&nbsp;<code style={{ fontFamily:'var(--font-mono)', color:'#00aaff' }}>445</code>,&nbsp;
                        <code style={{ fontFamily:'var(--font-mono)', color:'#00aaff' }}>3389</code>,&nbsp;
                        <code style={{ fontFamily:'var(--font-mono)', color:'#00aaff' }}>22</code>) for full threat profile generation.
                    </span>
                </div>
            )}

            {/* Individual warning cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {frameworkWarnings.map((msg, i) => {
                    const meta = warnType(msg);
                    return (
                        <div key={i} style={{
                            borderLeft: `2px solid ${meta.border}`,
                            background: meta.bg,
                            padding: '10px 16px',
                            display: 'flex', alignItems: 'flex-start', gap: '12px',
                        }}>
                            <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                                color: meta.tagColor, fontWeight: 700, letterSpacing: '0.1em',
                                border: `1px solid ${meta.border}`,
                                padding: '2px 6px', flexShrink: 0, marginTop: '2px',
                            }}>
                                {meta.tag}
                            </span>
                            <span style={{
                                fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
                                color: '#888', lineHeight: 1.55,
                            }}>
                                {msg}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Known vs Unknown breakdown chips — shown when mixed */}
            {(unknownPorts.length > 0 || unmatchedMisconfigs.length > 0) && (
                <div style={{
                    marginTop: '10px',
                    display: 'flex', flexWrap: 'wrap', gap: '6px',
                }}>
                    {unknownPorts.map(p => (
                        <span key={p} style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                            color: '#ffaa00', border: '1px solid rgba(255,170,0,0.3)',
                            background: 'rgba(255,170,0,0.05)',
                            padding: '3px 9px', letterSpacing: '0.06em',
                        }}>
                            Port {p} — unknown
                        </span>
                    ))}
                    {unmatchedMisconfigs.map((m, i) => (
                        <span key={i} style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                            color: '#ff8c00', border: '1px solid rgba(255,140,0,0.3)',
                            background: 'rgba(255,140,0,0.05)',
                            padding: '3px 9px', letterSpacing: '0.06em',
                            maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', display: 'inline-block',
                        }}>
                            Misconfig unmatched: {m.slice(0, 30)}{m.length > 30 ? '…' : ''}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Priority Action Banner ────────────────────────────────────────────────────
// Replaces "Next Likely Move" — uses evidence-aware language, shows the highest-
// confidence observed or inferred finding rather than a fictional predicted action.
function PriorityActionBanner({ attackChain }) {
    // Prefer phases with direct evidence, then highest severity
    const phase = attackChain.find(p => p.evidenceType === 'observed' && p.riskLevel === 'critical')
        || attackChain.find(p => p.evidenceType === 'observed')
        || attackChain.find(p => p.riskLevel === 'critical')
        || attackChain.find(p => p.riskLevel === 'high')
        || attackChain[0];
    if (!phase) return null;
    const tech = phase.techniques?.[0];
    const isObserved = phase.evidenceType === 'observed';
    const borderColor = isObserved ? '#e8183a' : '#ffaa00';
    const headerLabel = isObserved ? 'TELEMETRY ALERT' : 'PRIORITY EXPOSURE';
    return (
        <div style={{
            borderLeft: `2px solid ${borderColor}`,
            background: isObserved ? 'rgba(232,24,58,0.07)' : 'rgba(255,170,0,0.05)',
            padding: '16px 24px',
            marginBottom: '40px',
            display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: borderColor, letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                    {headerLabel} • {phase.phase}
                </p>
                <EvidenceBadge type={phase.evidenceType} small />
            </div>
            {tech && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#888', margin: 0, lineHeight: 1.6 }}>
                    {tech.id && <span style={{ color: '#00aaff', fontWeight: 700, fontFamily: 'var(--font-mono)', marginRight: '8px' }}>{tech.id}</span>}
                    {tech.description}
                </p>
            )}
            {phase.supportingEvidence?.length > 0 && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', margin: 0, letterSpacing: '0.06em' }}>
                    Evidence: {phase.supportingEvidence.slice(0, 2).join(' • ')}
                </p>
            )}
        </div>
    );
}

// ─── Analysis Summary ─────────────────────────────────────────────────────────
function AnalysisSummary({ summary, confidenceScore, detectionDifficulty, estimatedDwellTime, confidenceMetrics }) {
    const sections = summary.split('\n\n').filter(s => s.trim());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 border-y border-[#1a1a1a] py-7 mb-12">
            <div>
                {/* Disclaimer strip */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(0,170,255,0.06)', border: '1px solid rgba(0,170,255,0.2)',
                    padding: '4px 10px', marginBottom: '12px',
                }}>
                    <EyeIcon />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#00aaff', letterSpacing: '0.1em' }}>
                        EXPOSURE &amp; RISK POSTURE ASSESSMENT — NOT A CONFIRMED BREACH REPORT
                    </span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#888', lineHeight: 1.7 }}>
                    {sections.map((section, idx) => {
                        const lines = section.trim().split('\n');
                        const headerLine = lines[0];
                        const contentLines = lines.slice(1);
                        const isHeader = /^\d\.\s[A-Z\s]+$/.test(headerLine);
                        
                        return (
                            <div key={idx} style={{ marginBottom: idx === sections.length - 1 ? 0 : '20px' }}>
                                {isHeader ? (
                                    <>
                                        <h4 style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                                            color: '#00aaff', letterSpacing: '0.1em',
                                            textTransform: 'uppercase', marginBottom: '8px', marginTop: 0
                                        }}>
                                            {headerLine}
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {contentLines.map((line, lIdx) => {
                                                if (line.startsWith('* ')) {
                                                    return (
                                                        <div key={lIdx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '4px' }}>
                                                            <span style={{ color: '#00ff9d', fontSize: '0.8rem', marginTop: '2px', lineHeight: 1 }}>▸</span>
                                                            <span style={{ color: '#888' }}>{line.substring(2)}</span>
                                                        </div>
                                                    );
                                                }
                                                return <p key={lIdx} style={{ margin: lIdx === 0 ? '0 0 8px 0' : '4px 0 0', color: '#888' }}>{line}</p>;
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{section}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
                {confidenceMetrics?.dataSources?.length > 0 && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', marginTop: '12px', letterSpacing: '0.06em' }}>
                        Data sources: {confidenceMetrics.dataSources.join(' • ')}
                    </p>
                )}
            </div>
            <div className="flex flex-col min-w-[220px] lg:border-l lg:border-[#1a1a1a] lg:pl-10">
                {[
                    { label: 'ASSESSMENT CONFIDENCE', value: `${confidenceScore}%`, color: '#00aaff' },
                    { label: 'DWELL TIME',             value: estimatedDwellTime || 'Unknown', color: '#fff' },
                    { label: 'DETECTION STATUS',       value: detectionDifficulty || 'Unknown', color: '#fff' },
                ].map(({ label, value, color }) => (
                    <div key={label} style={{ padding: '14px 0', borderBottom: '1px solid #111' }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#444', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 700, color, margin: 0 }}>{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Attack Chain Row (expandable) ───────────────────────────────────────────
function PhaseRow({ phase, index }) {
    const [expanded, setExpanded] = useState(false);
    const sc = severityColor(phase.riskLevel);
    const [hovered, setHovered] = useState(false);

    return (
        <div style={{ borderBottom: '1px solid #111' }}>
            {/* Main row */}
            <div
                onClick={() => setExpanded(e => !e)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '14px 0', cursor: 'pointer',
                    background: hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
                    transition: 'background 0.15s',
                }}>

                {/* Number badge */}
                <div style={{
                    background: sc.bg, color: sc.text,
                    width: '28px', height: '28px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem',
                }}>
                    {index + 1}
                </div>

                {/* Phase name + MITRE tactic */}
                <div style={{ width: '240px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.88rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        {phase.phase}
                    </span>
                    {phase.mitreId && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#00aaff', border: '1px solid rgba(0,170,255,0.35)', padding: '2px 6px', flexShrink: 0 }}>
                            {phase.mitreId}
                        </span>
                    )}
                </div>

                {/* Technique ID pills */}
                <div style={{ flex: 1, display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {phase.techniques?.map(t => (
                        <span key={t.id || t.name} style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#666',
                            background: '#0a0a0a', border: '1px solid #1f1f1f', padding: '3px 7px',
                        }}>
                            {t.id}
                        </span>
                    ))}
                </div>

                {/* Evidence badge + Time + severity + toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <EvidenceBadge type={phase.evidenceType} small />
                    {phase.timeEstimate && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#444' }}>
                            {phase.timeEstimate}
                        </span>
                    )}
                    {typeof phase.confidence === 'number' && phase.confidence > 0 && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#777', border: '1px solid #222', padding: '3px 7px' }}>
                            C {phase.confidence}%
                        </span>
                    )}
                    {typeof phase.likelihoodScore === 'number' && phase.likelihoodScore > 0 && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#777', border: '1px solid #222', padding: '3px 7px' }}>
                            L {phase.likelihoodScore}
                        </span>
                    )}
                    <span style={{
                        background: sc.bg, color: sc.text,
                        fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 700,
                        padding: '3px 10px', letterSpacing: '0.08em',
                    }}>
                        {phase.riskLevel?.toUpperCase()}
                    </span>
                    <span style={{ color: expanded ? '#00aaff' : '#333', transition: 'color 0.15s' }}>
                        {expanded ? <MinusIcon /> : <PlusIcon />}
                    </span>
                </div>
            </div>

            {/* Expanded detail */}
            {expanded && phase.techniques?.length > 0 && (
                <div style={{ padding: '4px 0 16px 44px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Supporting evidence strip */}
                    {phase.supportingEvidence?.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            {phase.supportingEvidence.map((e, i) => (
                                <span key={i} style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#555',
                                    background: '#060606', border: '1px solid #1a1a1a',
                                    padding: '2px 8px', letterSpacing: '0.04em',
                                }}>
                                    ▸ {e}
                                </span>
                            ))}
                        </div>
                    )}
                    {phase.prerequisites?.length > 0 && (
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#444', margin: 0, letterSpacing: '0.04em' }}>
                            Prerequisites: {phase.prerequisites.join(' | ')}
                        </p>
                    )}
                    {phase.generatedBecause?.length > 0 && (
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#444', margin: 0, letterSpacing: '0.04em' }}>
                            Generated because: {phase.generatedBecause.join(' | ')}
                        </p>
                    )}
                    {phase.techniques.map(t => (
                        <div key={t.id || t.name} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0, minWidth: '70px' }}>
                                {t.id && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#00aaff' }}>{t.id}</span>}
                                <EvidenceBadge type={t.evidenceType} small />
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#666', lineHeight: 1.6 }}>
                                    {t.name ? <strong style={{ color: '#999', marginRight: '6px' }}>{t.name}:</strong> : null}
                                    {t.description}
                                </span>
                                {t.generatedBecause?.length > 0 && (
                                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#333', marginTop: '4px', letterSpacing: '0.04em' }}>
                                        Generated because: {t.generatedBecause.join('; ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function AttackStagesSection({ attackChain }) {
    if (!attackChain?.length) return null;
    return (
        <div style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                {/* Reference: font-extrabold uppercase tracking-tighter style */}
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    Attack Chain
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#444', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    MITRE ATT&amp;CK
                </span>
            </div>
            <div style={{ borderTop: '1px solid #1a1a1a' }}>
                {attackChain.map((phase, i) => <PhaseRow key={i} phase={phase} index={i} />)}
            </div>
        </div>
    );
}

// ─── Mitigations ──────────────────────────────────────────────────────────────
function MitigationsSection({ mitigations }) {
    if (!mitigations?.length) return null;
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    const sorted = [...mitigations].sort((a, b) =>
        (order[a.priority?.toLowerCase()] ?? 4) - (order[b.priority?.toLowerCase()] ?? 4)
    );
    return (
        <div style={{ marginBottom: '56px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', margin: 0, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                Recommended Mitigations
            </h3>
            <div style={{ borderTop: '1px solid #1a1a1a' }}>
                {sorted.map((m, i) => {
                    const sc = severityColor(m.priority);
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '14px 0', borderBottom: '1px solid #111' }}>
                            <div style={{ width: '68px', flexShrink: 0 }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#444', background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '3px 7px' }}>
                                    {m.id || `M${1000 + i}`}
                                </span>
                            </div>
                            <p style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#bbb', margin: 0, lineHeight: 1.55 }}>
                                {m.description || m.title}
                            </p>
                            <span style={{ background: sc.bg, color: sc.text, fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 700, padding: '3px 10px', letterSpacing: '0.08em', flexShrink: 0 }}>
                                {m.priority?.toUpperCase()}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Evidence Summary Section ─────────────────────────────────────────────────
// Displays the three evidence tiers in a scannable format so analysts immediately
// understand what is confirmed vs inferred vs modelled.
function EvidenceSummarySection({ evidenceSummary }) {
    if (!evidenceSummary) return null;
    const { observedFindings = [], inferredRisks = [], hypotheticalScenarios = [] } = evidenceSummary;
    if (observedFindings.length + inferredRisks.length + hypotheticalScenarios.length === 0) return null;

    const tiers = [
        { key: 'observed',     label: 'Observed Findings',     items: observedFindings,      color: '#00ff9d', bg: 'rgba(0,255,157,0.04)',  border: 'rgba(0,255,157,0.15)',  note: 'Directly confirmed from provided data' },
        { key: 'inferred',     label: 'Inferred Risks',        items: inferredRisks,         color: '#ffaa00', bg: 'rgba(255,170,0,0.04)',  border: 'rgba(255,170,0,0.15)',  note: 'Statistically likely based on TTP patterns' },
        { key: 'hypothetical', label: 'Modelled Scenarios',    items: hypotheticalScenarios, color: '#00aaff', bg: 'rgba(0,170,255,0.03)', border: 'rgba(0,170,255,0.12)', note: 'Worst-case scenarios — not confirmed events' },
    ].filter(t => t.items.length > 0);

    return (
        <div style={{ marginBottom: '56px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', margin: 0, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                Evidence Classification
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', marginBottom: '24px', letterSpacing: '0.08em' }}>
                Findings are classified by evidence strength — not all phases indicate confirmed compromise
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a1a1a' }}>
                {tiers.map(tier => (
                    <div key={tier.key} style={{ background: tier.bg, border: `1px solid ${tier.border}`, padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <EvidenceBadge type={tier.key} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', letterSpacing: '0.08em' }}>{tier.note}</span>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {tier.items.slice(0, 5).map((item, i) => (
                                <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <span style={{ color: tier.color, flexShrink: 0, marginTop: '2px', fontSize: '0.6rem' }}>▸</span>
                                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#888', lineHeight: 1.5 }}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── IOC Table ────────────────────────────────────────────────────────────────
function IOCSection({ iocList }) {
    if (!iocList?.length) {
        return (
            <div style={{ marginBottom: '56px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', margin: 0, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    Indicators of Compromise
                </h3>
                <div style={{ border: '1px dashed #222', padding: '24px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#333', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>
                        No IOCs extracted — provide log telemetry to surface real indicators
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#2a2a2a', marginTop: '6px', letterSpacing: '0.06em' }}>
                        IOCs are only generated from actual log data. No fabricated hashes or IPs are produced.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    Indicators of Compromise
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#444', letterSpacing: '0.12em' }}>
                    FROM LOG TELEMETRY ONLY
                </span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#333', marginBottom: '16px', letterSpacing: '0.06em' }}>
                All IOCs extracted from provided log data. Verify against threat intel feeds before actioning.
            </p>
            <div className="overflow-x-auto w-full pb-4">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                        {['Severity', 'Type', 'Value', 'Confidence', 'Status', 'Context'].map(h => (
                            <th key={h} style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                                color: '#444', padding: '12px 0', fontWeight: 400,
                                letterSpacing: '0.14em', textTransform: 'uppercase',
                            }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {iocList.map((ioc, i) => {
                        const sc = severityColor(ioc.severity);
                        return (
                            <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                                <td style={{ padding: '12px 8px 12px 0' }}>
                                    <span style={{ background: sc.bg, color: sc.text, fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 700, padding: '3px 8px' }}>
                                        {ioc.severity?.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#555' }}>{ioc.type?.toUpperCase()}</td>
                                <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00aaff', maxWidth: '220px', wordBreak: 'break-all' }}>{ioc.value}</td>
                                <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#888' }}>
                                    {ioc.confidence || 0}% / R{ioc.reputationScore || 0} / A{ioc.anomalyScore || 0}
                                </td>
                                <td style={{ padding: '12px 8px' }}>
                                    {ioc.verified
                                        ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', fontWeight: 700, color: '#00ff9d', border: '1px solid rgba(0,255,157,0.35)', padding: '2px 6px' }}>VERIFIED</span>
                                        : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', fontWeight: 700, color: '#ffaa00', border: '1px solid rgba(255,170,0,0.35)', padding: '2px 6px' }}>UNVERIFIED</span>
                                    }
                                </td>
                                <td style={{ padding: '12px 8px', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#666' }}>
                                    {ioc.label}
                                    {ioc.falsePositiveNotes && (
                                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#333', margin: '4px 0 0', letterSpacing: '0.03em' }}>
                                            FP reduction: {ioc.falsePositiveNotes}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
        </div>
    );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function ResultsPanel({ result, onNewAnalysis }) {
    if (!result) return null;
    return (
        <div style={{ color: '#fff', fontFamily: 'var(--font-sans)' }}
            aria-label="Analysis Results" role="region">

            <TopSummaryBar result={result} onNewAnalysis={onNewAnalysis} />

            {/* Unknown Port Handling Framework — warning banners */}
            <FrameworkWarningBanner
                frameworkWarnings={result.frameworkWarnings}
                portIntelStatus={result.portIntelStatus}
            />

            <PriorityActionBanner attackChain={result.attackChain} />

            <AnalysisSummary
                summary={result.summary}
                confidenceScore={result.confidenceScore}
                detectionDifficulty={result.detectionDifficulty}
                estimatedDwellTime={result.estimatedDwellTime}
                confidenceMetrics={result.confidenceMetrics}
            />

            <EvidenceSummarySection evidenceSummary={result.evidenceSummary} />

            {result.attackChain.length > 0 && (
                <AttackStagesSection attackChain={result.attackChain} />
            )}

            <MitigationsSection mitigations={result.mitigations} />

            <IOCSection iocList={result.iocList} />
        </div>
    );
}
