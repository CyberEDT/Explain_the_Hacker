import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import useExplainHacker from './useExplainHacker';
import AttackSimulationForm from './AttackSimulationForm';
import ResultsPanel from './ResultsPanel';

const ThreatVisualization = lazy(() => import('./ThreatVisualization'));

// ─── Icons ────────────────────────────────────────────────────────────────────
function AlertCircleIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}
function SmallAlertIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}
function CloseIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

// ─── Error Banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
            background: 'rgba(255,0,51,0.06)',
            border: '1px solid rgba(255,0,51,0.25)',
            borderLeft: '3px solid #e8183a',
            padding: '14px 16px',
        }} role="alert">
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#e8183a', flexShrink: 0, marginTop: '1px' }}><SmallAlertIcon /></span>
                <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: '#e8183a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>
                        ANALYSIS ERROR
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#888' }}>{message}</p>
                </div>
            </div>
            <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', flexShrink: 0 }}>
                <CloseIcon />
            </button>
        </div>
    );
}

// ─── Loading State ────────────────────────────────────────────────────────────
const LOADING_PHASES = [
    'MAPPING EXPOSED ATTACK SURFACE...',
    'CORRELATING MITRE ATT&CK TECHNIQUES...',
    'SIMULATING LATERAL MOVEMENT PATHS...',
    'IDENTIFYING INDICATORS OF COMPROMISE...',
    'GENERATING DEFENSE RECOMMENDATIONS...',
];

function LoadingState({ onCancel }) {
    const [phase, setPhase] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setPhase(p => (p + 1) % LOADING_PHASES.length), 1800);
        return () => clearInterval(t);
    }, []);
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px', gap: '20px', minHeight: '400px',
        }}>
            {/* Spinner */}
            <div style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '2px solid #1a1a1a',
                borderTopColor: '#e8183a',
                animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#e8183a', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                ANALYZING THREAT CHAIN
            </p>
            {/* Progress bar */}
            <div style={{ width: '260px', height: '1px', background: '#1a1a1a', position: 'relative', overflow: 'hidden' }}>
                <div className="progress-bar" style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#e8183a' }} />
            </div>
            <p key={phase} className="animate-fade-in" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#444', letterSpacing: '0.1em', minHeight: '1rem' }}>
                {LOADING_PHASES[phase]}
            </p>
            {onCancel && (
                <button type="button" onClick={onCancel} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.1em', padding: '8px 20px',
                    background: 'transparent', color: '#666', border: '1px solid #2a2a2a', cursor: 'pointer',
                }}>
                    CANCEL
                </button>
            )}
        </div>
    );
}

// ─── Empty State (reference: dashed border, "No analyses yet" style) ──────────
function EmptyState() {
    return (
        <div style={{
            border: '1px dashed #222',
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        }}>
            <span style={{ color: '#e8183a', opacity: 0.5 }}><AlertCircleIcon /></span>
            <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                color: '#555', letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>
                AWAITING SIMULATION DATA
            </p>
            <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#333',
                maxWidth: '360px', lineHeight: 1.7, letterSpacing: '0.04em',
            }}>
                Enter attack inputs and run analysis to view the simulation overview, threat score, attack chain, and MITRE mapping.
            </p>
        </div>
    );
}

// ─── Risk colour ──────────────────────────────────────────────────────────────
function riskColor(s) {
    if (s >= 80) return '#e8183a';
    if (s >= 60) return '#ffaa00';
    if (s >= 40) return '#00aaff';
    return '#00ff9d';
}

// ─── Recent Analyses Sidebar — matches reference design ───────────────────────
function HistorySidebar({ history, onSelect }) {
    const [filter, setFilter] = useState('all');

    const filtered = history.filter(e => {
        if (filter === 'high')   return e.riskScore >= 70;
        if (filter === 'medium') return e.riskScore >= 40 && e.riskScore < 70;
        if (filter === 'low')    return e.riskScore < 40;
        return true;
    });

    const tabs = [
        { key: 'all',    label: 'All' },
        { key: 'high',   label: 'High' },
        { key: 'medium', label: 'Medium' },
        { key: 'low',    label: 'Low' },
    ];

    return (
        // Reference: border border-border bg-white/[0.02] p-5 lg:sticky lg:top-24
        <div style={{
            border: '1px solid #1f1f1f',
            background: 'rgba(255,255,255,0.015)',
            padding: '20px',
            position: 'sticky',
            top: '88px',  // account for nav height
        }}>
            {/* Header — reference: flex items-center gap-2 mb-5 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ width: 8, height: 8, background: '#e8183a', flexShrink: 0 }} />
                <h3 style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    textTransform: 'uppercase', letterSpacing: '0.3em', color: '#fff', margin: 0,
                }}>
                    Recent Analyses
                </h3>
            </div>

            {/* Filter tabs — reference: flex gap-px bg-border mb-4 */}
            <div style={{ display: 'flex', gap: '1px', background: '#1f1f1f', marginBottom: '16px' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setFilter(t.key)} style={{
                        flex: 1, padding: '8px 4px',
                        background: filter === t.key ? '#fff' : '#000',
                        color: filter === t.key ? '#000' : '#555',
                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: filter === t.key ? 700 : 400,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        border: 'none', cursor: 'pointer',
                        transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { if (filter !== t.key) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (filter !== t.key) e.currentTarget.style.background = '#000'; }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {history.length === 0 ? (
                // Reference: border border-dashed border-border p-6 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-widest
                <div style={{
                    border: '1px dashed #222', padding: '24px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em',
                }}>
                    No analyses yet
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    border: '1px dashed #222', padding: '24px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em',
                }}>
                    No results
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '520px', overflowY: 'auto' }}>
                    {filtered.map(entry => (
                        <div key={entry.id} 
                             onClick={() => onSelect && onSelect(entry.id)}
                             style={{
                            padding: '10px 12px',
                            borderLeft: `2px solid ${riskColor(entry.riskScore)}`,
                            background: '#0a0a0a',
                            cursor: 'pointer',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    {entry.portCount} PORT{entry.portCount !== 1 ? 'S' : ''}
                                </span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: riskColor(entry.riskScore) }}>
                                    {entry.riskScore}
                                </span>
                            </div>
                            <p style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#666', lineHeight: 1.5,
                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                                {entry.summary}
                            </p>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#333', marginTop: '5px', letterSpacing: '0.06em' }}>
                                {new Date(entry.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Stats Grid Item ──────────────────────────────────────────────────────────
function StatItem({ value, label }) {
    return (
        // Reference: bg-background px-4 py-6
        <div style={{ background: '#000', padding: '24px 16px' }}>
            <div style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                color: '#e8183a', lineHeight: 1, fontWeight: 800,
            }}>
                {value}
            </div>
            <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                color: '#555', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '12px',
            }}>
                {label}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExplainTheHacker() {
    const navigate = useNavigate();
    const {
        loading, error, result, formValues, fieldErrors, history,
        addPort, addPorts, removePort,
        addMisconfiguration, removeMisconfiguration,
        setLogSnippet,
        handleSubmit, resetForm, clearResult, cancelAnalysis, loadHistoryItem,
    } = useExplainHacker();

    const resultsRef = useRef(null);
    useEffect(() => {
        if (result && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [result]);

    return (
        // Reference outer: min-h-screen bg-background text-foreground font-display
        <div style={{ background: '#000', color: '#fff', flex: 1, minHeight: '100vh' }}>

            {/* ── Page Header — reference: max-w-[1440px] mx-auto px-6 pt-12 pb-8 border-b border-border ── */}
            <header style={{
                maxWidth: '1440px', margin: '0 auto',
                padding: '48px 24px 32px',
                borderBottom: '1px solid #1a1a1a',
            }}>
                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        {/* Back link */}
                        <button onClick={() => navigate('/')} style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                            color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '0 0 16px 0', transition: 'color 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#aaa'}
                            onMouseLeave={e => e.currentTarget.style.color = '#555'}
                        >
                            ← Home
                        </button>
                        {/* Reference: text-5xl md:text-7xl font-extrabold uppercase tracking-tighter leading-[0.9] */}
                        <h1 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '-0.03em',
                            lineHeight: 0.9,
                            margin: 0,
                            color: '#fff',
                        }}>
                            Threat Simulation
                        </h1>
                        {/* Reference: font-mono text-xs text-muted-foreground mt-3 uppercase tracking-widest */}
                        <p style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                            color: '#555', marginTop: '12px',
                            textTransform: 'uppercase', letterSpacing: '0.25em',
                        }}>
                            CyberEDT • Attack-Chain Engine
                        </p>
                    </div>

                    {/* Reference: font-mono text-[10px] bg-foreground text-background px-3 py-1.5 uppercase tracking-widest */}
                    <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                        background: '#fff', color: '#000',
                        padding: '6px 12px',
                        textTransform: 'uppercase', letterSpacing: '0.2em',
                        fontWeight: 700,
                    }}>
                        CyberEDT
                    </div>
                </div>

                {/* Description */}
                <p style={{
                    marginTop: '32px',
                    maxWidth: '70ch',
                    fontSize: '1rem',
                    color: '#888',
                    lineHeight: 1.65,
                    fontFamily: 'var(--font-sans)',
                }}>
                    Input exposed ports, known misconfigurations, and log snippets. Get a full MITRE ATT&CK attack-chain simulation, IOC mapping, and actionable mitigations — instantly.
                </p>

                {/* Stats grid — reference: grid grid-cols-2 md:grid-cols-4 gap-px bg-border mt-10 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1a1a] mt-10">
                    <StatItem value="7+" label="Attack Phases" />
                    <StatItem value="200+" label="MITRE Techniques" />
                    <StatItem value="5" label="IOC Types" />
                    <StatItem value="8" label="Threat Vectors" />
                </div>
            </header>

            {/* ── Main Content — reference: max-w-[1440px] mx-auto px-6 py-12 grid grid-cols-12 gap-6 ── */}
            <main className="max-w-[1440px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ── LEFT (8 cols): Form + Results ─────────────────────────── */}
                {/* Reference: col-span-12 lg:col-span-8 space-y-px bg-border */}
                <section className="lg:col-span-8 flex flex-col gap-px bg-[#1a1a1a]">
                    {error && (
                        <div style={{ background: '#000', padding: '16px 24px' }}>
                            <ErrorBanner message={error} onDismiss={clearResult} />
                        </div>
                    )}

                    {/* Form sections — each in a white background div */}
                    <AttackSimulationForm
                        formValues={formValues}
                        fieldErrors={fieldErrors}
                        loading={loading}
                        onAddPort={addPort}
                        onAddPorts={addPorts}
                        onRemovePort={removePort}
                        onAddMisconfiguration={addMisconfiguration}
                        onRemoveMisconfiguration={removeMisconfiguration}
                        onLogSnippetChange={setLogSnippet}
                        onSubmit={handleSubmit}
                        onReset={resetForm}
                    />
                </section>

                {/* ── RIGHT (4 cols): Sidebar ───────────────────────────────── */}
                <div className="lg:col-span-4 flex-shrink-0">
                    <HistorySidebar history={history} onSelect={loadHistoryItem} />
                </div>

                {/* ── Results Row (full width) ──────────────────────────────── */}
                {(loading || result) && (
                    <div ref={resultsRef} className="lg:col-span-12 bg-black border border-[#1a1a1a] p-8">
                        {/* Panel header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            paddingBottom: '24px', marginBottom: '24px',
                            borderBottom: '1px solid #1a1a1a',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: 8, height: 8, background: '#e8183a', flexShrink: 0, animation: loading ? 'pulse-dot 1s infinite' : 'none' }} />
                                <span style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700,
                                    color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase',
                                }}>
                                    Simulation Overview
                                </span>
                            </div>
                            {result && (
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#444', letterSpacing: '0.08em' }}>
                                    Scenario: Custom Target Analysis
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <LoadingState onCancel={cancelAnalysis} />
                        ) : result ? (
                            <div>
                                <ResultsPanel result={result} onNewAnalysis={clearResult} />
                                <Suspense fallback={
                                    <div style={{ height: '200px', background: '#0a0a0a', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#333', letterSpacing: '0.1em' }}>LOADING VISUALIZATION...</span>
                                    </div>
                                }>
                                    <ThreatVisualization result={result} />
                                </Suspense>

                                {/* Analysis Disclaimer */}
                                <div style={{
                                    marginTop: '24px',
                                    padding: '16px',
                                    background: 'rgba(0,170,255,0.05)',
                                    border: '1px solid rgba(0,170,255,0.2)',
                                    display: 'flex', gap: '12px', alignItems: 'flex-start'
                                }}>
                                    <span style={{ color: 'var(--color-info)', marginTop: '2px' }}><AlertCircleIcon /></span>
                                    <div>
                                        <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-info)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                                            Analysis Disclaimer
                                        </strong>
                                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', margin: 0, lineHeight: 1.4 }}>
                                            AI-generated analysis may contain inferred findings. Attack-path simulations are predictive models and do not guarantee active compromise. Always validate findings manually.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* ── Empty state — shows when no result yet and not loading ── */}
                {!loading && !result && (
                    <div className="lg:col-span-12">
                        <EmptyState />
                    </div>
                )}
            </main>

        </div>
    );
}
