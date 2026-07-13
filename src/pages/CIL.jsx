import React, { useState, memo } from 'react';
import SEO from '@/components/SEO';

// ─── Shared W wrapper (identical to other pages) ───────────────────────────────
const W = { maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' };

// ─── Accent colours ────────────────────────────────────────────────────────────
const RED    = '#e8183a';
const BLUE   = '#00aaff';
const GREEN  = '#00ff9d';
const YELLOW = '#ffaa00';

// ─── Section heading (matches ThreatIntel / Roadmap SectionHeading) ────────────
function SectionHeading({ title, subtitle }) {
    return (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '8px', lineHeight: 1.1 }}>
                {title}
            </h2>
            {subtitle && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}

// ─── Radar Chart (memoised, pure SVG — no library) ────────────────────────────
const RadarChart = memo(({ data, size = 380 }) => {
    const c = size / 2;
    const r = c * 0.65;
    const angles = [-90, -18, 54, 126, 198].map(d => (d * Math.PI) / 180);
    const pt = (val, i) => {
        const rr = (val / 100) * r;
        return { x: c + rr * Math.cos(angles[i]), y: c + rr * Math.sin(angles[i]) };
    };
    const poly = key => data.map((d, i) => { const p = pt(d[key], i); return `${p.x},${p.y}`; }).join(' ');

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
            {[0.25, 0.5, 0.75, 1].map((s, i) => (
                <polygon key={i}
                    points={angles.map(a => `${c + r * s * Math.cos(a)},${c + r * s * Math.sin(a)}`).join(' ')}
                    fill="none" stroke="#1f1f1f" strokeWidth="1"
                    strokeDasharray={s === 1 ? undefined : '3,4'} />
            ))}
            {angles.map((a, i) => {
                const lx = c + (r + 30) * Math.cos(a);
                const ly = c + (r + 16) * Math.sin(a);
                return (
                    <g key={i}>
                        <line x1={c} y1={c} x2={c + r * Math.cos(a)} y2={c + r * Math.sin(a)} stroke="#1f1f1f" strokeWidth="1" />
                        <text x={lx} y={ly} fill="#666" fontSize="11" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">{data[i].subject}</text>
                    </g>
                );
            })}
            <polygon points={poly('A')} fill={YELLOW} fillOpacity="0.15" stroke={YELLOW} strokeWidth="2" />
            <polygon points={poly('B')} fill={RED}    fillOpacity="0.15" stroke={RED}    strokeWidth="2" />
            <polygon points={poly('C')} fill={GREEN}  fillOpacity="0.15" stroke={GREEN}  strokeWidth="2" />
        </svg>
    );
});
RadarChart.displayName = 'RadarChart';

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function CILPage() {

    // ── SharedIntelligenceObject local state ──
    const [open, setOpen] = useState({ asset: false, exposure: true, threat: true, defense: false, metadata: false });
    const toggle = k => setOpen(p => ({ ...p, [k]: !p[k] }));

    const jsonNodes = [
        { id: 'asset',    label: '"Asset"',    color: '#fff',   children: ['"id": "srv-01"', '"type": "infrastructure"'] },
        { id: 'exposure', label: '"Exposure"', color: YELLOW,  children: ['"ports": [445, 3389]', '"misconfigs": ["AUTH-002"]'] },
        { id: 'threat',   label: '"Threat"',   color: RED,     children: ['"riskScore": 92', '"mitreTactics": ["TA0001", "TA0008"]', '"attackPath": [...]'] },
        { id: 'defense',  label: '"Defense"',  color: GREEN,   children: ['"securityControls": [...]', '"hardeningGuidance": [...]'] },
        { id: 'metadata', label: '"Metadata"', color: '#888',  children: ['"timestamp": "2026-07-11T12:00:00Z"'] },
    ];

    const radarData = [
        { subject: 'Exposure',  A: 100, B: 20,  C: 40 },
        { subject: 'Attack',    A: 20,  B: 100, C: 30 },
        { subject: 'Defense',   A: 10,  B: 30,  C: 100 },
        { subject: 'Forensics', A: 10,  B: 10,  C: 10 },
        { subject: 'IR',        A: 0,   B: 0,   C: 20 },
    ];

    const schemaOrg = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'CIL — CyberEDT Intelligence Layer Architecture',
        description: 'The CyberEDT Intelligence Layer (CIL) is the shared intelligence backbone connecting every CyberEDT application.',
        author: { '@type': 'Organization', name: 'CyberEDT', url: 'https://www.cyberedt.com/' },
    };

    return (
        <main style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)', paddingBottom: '100px' }}>
            <SEO
                title="CIL Architecture"
                description="The CyberEDT Intelligence Layer (CIL) is the shared intelligence backbone connecting every CyberEDT application."
                canonicalUrl="/cil"
                schema={schemaOrg}
            />

            {/* ── Hero ─────────────────────────────────────────────────────────── */}
            <section aria-labelledby="cil-hero-title"
                style={{ borderBottom: '1px solid var(--color-border)', paddingTop: '40px', background: 'radial-gradient(circle at 50% 0%, rgba(0,170,255,0.08) 0%, #000 70%)' }}>
                <header style={{ ...W }}>
                    <div aria-hidden="true" className="terminal-label" style={{ marginBottom: '24px', color: BLUE }}>
                        CYBEREDT ARCHITECTURE
                    </div>
                    <h1 id="cil-hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '24px' }}>
                        The Intelligence Layer <span style={{ color: 'var(--color-text-muted)' }}>// CIL</span>
                    </h1>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#aaa', lineHeight: 1.6, maxWidth: '700px', marginBottom: '40px' }}>
                        The secure intelligence backbone connecting every CyberEDT application. Unifying threat data without compromising modularity or independence.
                    </p>
                    {/* Stat bar */}
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', paddingBottom: '40px' }}>
                        {[
                            { val: '3', label: 'Connected Applications', color: BLUE },
                            { val: '1', label: 'Shared Intelligence Schema', color: YELLOW },
                            { val: '0', label: 'Hard Dependencies', color: GREEN },
                        ].map(s => (
                            <div key={s.label} style={{ borderLeft: `2px solid ${s.color}`, paddingLeft: '16px' }}>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: '#fff', fontWeight: 700 }}>{s.val}</div>
                                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </header>
            </section>

            {/* ── 1. What is CIL ───────────────────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid var(--color-border)', background: '#050505' }}>
                <div style={{ ...W }}>
                    <SectionHeading title="1. What is CIL?" subtitle="Not a scanner. Not a database. A shared intelligence contract." />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#bbb', lineHeight: 1.8, marginBottom: '24px' }}>
                                CIL is a <strong style={{ color: '#fff' }}>shared intelligence layer</strong> that allows CyberEDT applications to exchange standardised cybersecurity intelligence while remaining completely independent of each other.
                            </p>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#bbb', lineHeight: 1.8 }}>
                                It eliminates duplicated analysis by ensuring each tool focuses on its sole responsibility — publishing its findings once to CIL, and reading what it needs from other tools through the same layer.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { icon: '○', label: 'NOT a vulnerability scanner', color: RED },
                                { icon: '○', label: 'NOT a threat database or SIEM', color: RED },
                                { icon: '✓', label: 'A standardised JSON schema', color: GREEN },
                                { icon: '✓', label: 'A shared session store (localStorage + BroadcastChannel)', color: GREEN },
                                { icon: '✓', label: 'A cross-app intelligence contract', color: GREEN },
                            ].map((r, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#000', border: '1px solid #1a1a1a' }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: r.color, width: '14px', flexShrink: 0 }}>{r.icon}</span>
                                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#ccc' }}>{r.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. Core Philosophy ───────────────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ ...W }}>
                    <SectionHeading title="2. Core Philosophy" subtitle="Four principles that define the CyberEDT architecture." />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                        {[
                            { num: '01', title: 'Modular', desc: 'Every application operates strictly within its own domain. CIL simply acts as the bridge between them.', color: BLUE },
                            { num: '02', title: 'Independent', desc: 'Zero hard dependencies between tools. If one application fails or is offline, the others continue working.', color: YELLOW },
                            { num: '03', title: 'Connected', desc: 'Shared standardised JSON objects allow fluid exchange of exposure, threat, and defensive intelligence.', color: RED },
                            { num: '04', title: 'Scalable', desc: 'New tools plug into the ecosystem seamlessly. Existing applications never require modification.', color: GREEN },
                        ].map(p => (
                            <div key={p.num} style={{ border: '1px solid #1a1a1a', background: '#050505', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: p.color, opacity: 0.6 }} />
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: p.color, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>{p.num}</div>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase', marginBottom: '12px', margin: '0 0 12px 0' }}>{p.title}</h4>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#777', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. Intelligence Flow ─────────────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid var(--color-border)', background: '#050505' }}>
                <div style={{ ...W }}>
                    <SectionHeading title="3. Intelligence Flow" subtitle="How raw data transforms as it moves through the CyberEDT ecosystem via CIL." />
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: '0' }}>
                        {[
                            { step: '01', name: 'Nmap / Logs', type: 'Raw Input', color: '#555', desc: 'Operator provides raw port scan output, system logs, or misconfigurations into EME.' },
                            { step: '02', name: 'EME', type: 'Exposure Intel', color: YELLOW, desc: 'Structures and scores the attack surface. Publishes an Exposure object to CIL.' },
                            { step: '03', name: 'ETH', type: 'Threat Intel', color: RED, desc: 'Reads Exposure from CIL. Builds kill chains and MITRE mappings. Publishes Threat object.' },
                            { step: '04', name: 'ETD', type: 'Defensive Intel', color: GREEN, desc: 'Reads Threat from CIL. Prescribes controls, detections, and hardening. Completes the loop.' },
                        ].map((s, i, arr) => (
                            <React.Fragment key={s.step}>
                                <article style={{ flex: 1, minWidth: '200px', border: '1px solid #1a1a1a', background: '#000', padding: '28px', position: 'relative' }}>
                                    <span style={{ position: 'absolute', top: -1, left: 20, background: '#000', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: s.color, fontWeight: 700, letterSpacing: '0.1em' }}>STEP {s.step}</span>
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#fff', marginBottom: '4px' }}>{s.name}</div>
                                        <div style={{ display: 'inline-block', border: `1px solid ${s.color}`, color: s.color, padding: '2px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>{s.type}</div>
                                    </div>
                                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#777', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                                </article>
                                {i < arr.length - 1 && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', color: '#333', fontSize: '1.5rem', flexShrink: 0 }}>→</div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. Ecosystem ─────────────────────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ ...W }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
                        <div>
                            <SectionHeading title="4. CyberEDT Ecosystem" subtitle="All applications connect exclusively to CIL — never directly to each other." />
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#bbb', lineHeight: 1.8, marginBottom: '32px' }}>
                                This is what makes the architecture truly modular. EME never calls ETH. ETH never calls ETD. Each tool is completely unaware of the others' existence. They only know about CIL.
                            </p>
                            {[
                                { name: 'EME', q: '"What is exposed?"', color: YELLOW },
                                { name: 'ETH', q: '"How would an attacker exploit this?"', color: RED },
                                { name: 'ETD', q: '"How should it be defended?"', color: GREEN },
                            ].map(app => (
                                <div key={app.name} style={{ borderLeft: `3px solid ${app.color}`, padding: '12px 20px', marginBottom: '12px', background: 'rgba(255,255,255,0.02)' }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff' }}>{app.name}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: app.color, marginLeft: '12px', letterSpacing: '0.04em' }}>{app.q}</span>
                                </div>
                            ))}
                        </div>

                        {/* Visual diagram */}
                        <div style={{ position: 'relative', width: '100%', maxWidth: '420px', height: '380px', margin: '0 auto' }}>
                            {/* Central node */}
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                width: '120px', height: '120px', borderRadius: '50%',
                                background: 'rgba(0,170,255,0.08)', border: `2px solid ${BLUE}`,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                zIndex: 10, filter: `drop-shadow(0 0 16px rgba(0,170,255,0.3))`,
                            }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#fff', lineHeight: 1 }}>CIL</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: BLUE, letterSpacing: '0.1em', marginTop: '4px' }}>INTEL LAYER</span>
                            </div>
                            {/* SVG lines */}
                            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                                <line x1="50%" y1="50%" x2="50%"  y2="12%"  stroke={YELLOW} strokeWidth="1.5" strokeDasharray="5,4" opacity="0.4" />
                                <line x1="50%" y1="50%" x2="12%"  y2="80%"  stroke={RED}    strokeWidth="1.5" strokeDasharray="5,4" opacity="0.4" />
                                <line x1="50%" y1="50%" x2="88%"  y2="80%"  stroke={GREEN}  strokeWidth="1.5" strokeDasharray="5,4" opacity="0.4" />
                            </svg>
                            {/* App nodes */}
                            {[
                                { label: 'EME', top: '4%',  left: '50%',  color: YELLOW },
                                { label: 'ETH', top: '73%', left: '8%',   color: RED },
                                { label: 'ETD', top: '73%', left: '82%',  color: GREEN },
                            ].map(n => (
                                <div key={n.label} style={{
                                    position: 'absolute', top: n.top, left: n.left, transform: 'translate(-50%, -50%)',
                                    width: '72px', height: '72px', borderRadius: '50%',
                                    background: '#0a0a0a', border: `2px solid ${n.color}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
                                }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff' }}>{n.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. Responsibilities ──────────────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid var(--color-border)', background: '#050505' }}>
                <div style={{ ...W }}>
                    <SectionHeading title="5. Responsibilities" subtitle="Each tool specialises exclusively in one domain. The radar shows the separation of concerns." />
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '48px' }}>
                        <div style={{ flex: '0 0 auto', width: '340px', height: '340px', maxWidth: '100%', margin: '0 auto' }}>
                            <RadarChart data={radarData} size={340} />
                            {/* Legend */}
                            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px' }}>
                                {[{ l: 'EME', c: YELLOW }, { l: 'ETH', c: RED }, { l: 'ETD', c: GREEN }].map(lg => (
                                    <div key={lg.l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '24px', height: '2px', background: lg.c }} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#888' }}>{lg.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { name: 'EME', color: YELLOW, q: '"What is exposed?"',                     desc: 'Maps attack surfaces, discovers exposed assets, and identifies missing security controls via NMAP output and misconfiguration analysis.' },
                                { name: 'ETH', color: RED,    q: '"How would an attacker exploit this?"',   desc: 'Generates predictive kill chains, maps findings to MITRE ATT&CK techniques, and produces a dynamic risk score.' },
                                { name: 'ETD', color: GREEN,  q: '"How should it be defended?"',            desc: 'Prescribes security controls, writes detection rules for SIEM/EDR tools, and provides step-by-step hardening guidance.' },
                            ].map(item => (
                                <div key={item.name} style={{ border: `1px solid #1a1a1a`, borderLeft: `3px solid ${item.color}`, padding: '20px 24px', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', margin: 0 }}>{item.name}</h4>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: item.color, border: `1px solid ${item.color}`, padding: '3px 10px' }}>{item.q}</span>
                                    </div>
                                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#888', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. Shared Intelligence Object ────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ ...W }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
                        <div>
                            <SectionHeading title="6. Shared Intelligence Object" subtitle="A standardised JSON schema is the single language all CyberEDT tools speak." />
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#bbb', lineHeight: 1.8, marginBottom: '24px' }}>
                                When EME finishes an exposure scan it writes one structured JSON object to CIL. ETH reads it. When ETH finishes its kill-chain analysis it writes back. ETD reads that. No API calls. No databases. Just a shared schema.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { key: 'Asset',    color: '#fff',  desc: 'Identifies the system under analysis' },
                                    { key: 'Exposure', color: YELLOW, desc: 'Ports, misconfigs, attack surface findings' },
                                    { key: 'Threat',   color: RED,    desc: 'Risk score, MITRE tactics, attack path' },
                                    { key: 'Defense',  color: GREEN,  desc: 'Controls, detection rules, hardening' },
                                    { key: 'Metadata', color: '#888', desc: 'Timestamps, source tool, session ID' },
                                ].map(f => (
                                    <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #111' }}>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: f.color, width: '80px', flexShrink: 0 }}>{f.key}</div>
                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#666' }}>{f.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive JSON tree */}
                        <div style={{ background: '#050505', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '28px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                            <div style={{ color: '#555', marginBottom: '8px' }}>{'{'}</div>
                            <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {jsonNodes.map(node => (
                                    <div key={node.id}>
                                        <div
                                            onClick={() => toggle(node.id)}
                                            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 6px', borderRadius: '4px', userSelect: 'none' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <span style={{ color: '#333', width: '12px', fontSize: '0.65rem' }}>{open[node.id] ? '▼' : '▶'}</span>
                                            <span style={{ color: node.color, fontWeight: 700 }}>{node.label}</span>
                                            <span style={{ color: '#444' }}>: {'{'}</span>
                                            {!open[node.id] && <span style={{ color: '#333' }}>... {'}'}</span>}
                                        </div>
                                        {open[node.id] && (
                                            <div style={{ paddingLeft: '24px', borderLeft: '1px solid #1a1a1a', marginLeft: '6px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                {node.children.map((c, i) => (
                                                    <div key={i} style={{ color: '#888', paddingLeft: '6px' }}>{c}</div>
                                                ))}
                                                <div style={{ color: '#444' }}>{'}'}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div style={{ color: '#555', marginTop: '8px' }}>{'}'}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. Key Benefits ──────────────────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid var(--color-border)', background: '#050505' }}>
                <div style={{ ...W }}>
                    <SectionHeading title="7. Key Benefits" subtitle="Why we chose an intelligence-layer approach over a monolithic application." />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                        {[
                            { title: 'No Duplicated Analysis',   desc: 'Each tool runs analysis once and shares results. No two tools solve the same problem twice.', color: BLUE },
                            { title: 'Independent Deployment',   desc: 'Deploy ETH alone, or all three together. The architecture supports any combination.', color: YELLOW },
                            { title: 'Faster Communication',     desc: 'BroadcastChannel delivers intelligence updates across open tabs in real-time with zero latency.', color: RED },
                            { title: 'Future Ready',             desc: 'Any new CyberEDT tool integrates by implementing the CIL schema — nothing else changes.', color: GREEN },
                            { title: 'Standardised Intelligence', desc: 'Every finding speaks the same language. MITRE IDs, risk scores, and IOCs are consistent across all tools.', color: BLUE },
                            { title: 'Modular Architecture',     desc: 'Remove any single tool and the others keep working. CIL outlasts any individual application.', color: YELLOW },
                        ].map(b => (
                            <div key={b.title} style={{ border: '1px solid #1a1a1a', background: '#000', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: b.color, opacity: 0.5 }} />
                                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px 0' }}>{b.title}</h4>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#666', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 8. Future Ecosystem ──────────────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ ...W }}>
                    <SectionHeading title="8. Future Ecosystem" subtitle="Every future application connects directly to CIL. Existing applications never require modification." />
                    <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#fff' }}>CIL</div>
                            <div style={{ height: '1px', flex: 1, background: '#222' }} />
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: BLUE, letterSpacing: '0.1em' }}>INTELLIGENCE LAYER</div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {[
                                { label: 'EME',                  status: 'LIVE',  color: YELLOW },
                                { label: 'ETH',                  status: 'LIVE',  color: RED },
                                { label: 'ETD',                  status: 'LIVE',  color: GREEN },
                                { label: 'IRP',                  status: 'SOON',  color: '#444' },
                                { label: 'SIEM Integration',     status: 'SOON',  color: '#444' },
                                { label: 'SOAR',                 status: 'SOON',  color: '#444' },
                                { label: 'Digital Forensics',    status: 'SOON',  color: '#444' },
                                { label: 'Cloud Security',       status: 'SOON',  color: '#444' },
                                { label: 'Identity Security',    status: 'SOON',  color: '#444' },
                                { label: 'Threat Intelligence',  status: 'SOON',  color: '#444' },
                            ].map(tool => (
                                <div key={tool.label} style={{
                                    border: `1px solid ${tool.status === 'LIVE' ? tool.color : '#1a1a1a'}`,
                                    background: tool.status === 'LIVE' ? `rgba(${tool.color === YELLOW ? '255,170,0' : tool.color === RED ? '232,24,58' : '0,255,157'},0.05)` : 'rgba(255,255,255,0.01)',
                                    padding: '10px 18px',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    borderStyle: tool.status === 'LIVE' ? 'solid' : 'dashed',
                                }}>
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: tool.status === 'LIVE' ? tool.color : '#333' }} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: tool.status === 'LIVE' ? '#ccc' : '#444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tool.label}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: tool.status === 'LIVE' ? tool.color : '#333', letterSpacing: '0.1em' }}>[{tool.status}]</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Closing ──────────────────────────────────────────────────────── */}
            <section style={{ padding: '0' }}>
                <div style={{ ...W }}>
                    <div style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,170,255,0.05) 0%, transparent 70%)', border: '1px solid #1a1a1a', padding: '64px', textAlign: 'center' }}>
                        <div className="terminal-label" style={{ marginBottom: '24px', color: BLUE }}>CYBEREDT ARCHITECTURE</div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 16px 0' }}>
                            One Intelligence Layer.<br />
                            <span style={{ color: '#444' }}>Multiple Applications.</span><br />
                            <span style={{ color: BLUE }}>Infinite Possibilities.</span>
                        </h2>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#555', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                            CIL ensures that as the CyberEDT ecosystem grows, every new application immediately benefits from the intelligence generated by every other tool.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
