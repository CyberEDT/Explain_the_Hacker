// ─── LandingPage.jsx ────────────────────────────────────────────────────────
// Faithful clone of the reference Lovable app UI:
//   - Hero: "VISUALIZING THE KILL CHAIN" in Bebas Neue
//   - Live Attack Chain Visualization (7 phase cards)
//   - Tactics Grid (MITRE ATT&CK framework)
//   - Threat Analyst article callout
//   - "START YOUR SIMULATION" CTA with INITIALIZE_LABS → /lab
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ATTACK_PHASES, TACTICS } from '../data/landingData';
import SEO from '@/components/SEO';



// ─── Phase Card ───────────────────────────────────────────────────────────────
export function PhaseCard({ phase }) {
    return (
        <article
            aria-labelledby={`phase-label-${phase.num}`}
            style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
            }}
        >
            {/* Phase number + label */}
            <header style={{ marginBottom: '8px' }}>
                <span aria-hidden="true" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', letterSpacing: '0.08em' }}>
                    {phase.num}
                </span>
                <h3 id={`phase-label-${phase.num}`} style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
                    {phase.label}
                </h3>
            </header>

            {/* Terminal card */}
            <div
                style={{
                    flex: 1,
                    background: phase.bg || '#0a0a0a',
                    border: phase.isDashed
                        ? '1px dashed rgba(255,0,51,0.4)'
                        : `1px solid ${phase.isCritical ? 'rgba(255,0,51,0.5)' : '#1f1f1f'}`,
                    padding: '12px',
                    minHeight: '100px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Colored top bar */}
                {phase.barWidth && (
                    <div aria-hidden="true" style={{ height: '2px', background: phase.color, width: phase.barWidth, marginBottom: '8px' }} />
                )}

                {phase.lines.map((line, i) => (
                    <p
                        key={i}
                        style={{
                            margin: 0,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6rem',
                            color: i === 0 && phase.isCritical ? '#ff0033' : i === 0 ? phase.color : '#444',
                            letterSpacing: '0.04em',
                            marginBottom: '3px',
                            fontWeight: i === 0 ? 700 : 400,
                        }}
                    >
                        {line}
                    </p>
                ))}

                {phase.isCritical && (
                    <div
                        aria-label="Critical Alert"
                        style={{
                            position: 'absolute',
                            bottom: 6,
                            right: 6,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.55rem',
                            color: '#ff0033',
                            background: 'rgba(255,0,51,0.1)',
                            border: '1px solid rgba(255,0,51,0.3)',
                            padding: '1px 5px',
                            letterSpacing: '0.08em',
                        }}
                    >
                        CRITICAL
                    </div>
                )}
            </div>
        </article>
    );
}

// ─── Tactic Cell ─────────────────────────────────────────────────────────────
export function TacticCell({ tactic }) {
    return (
        <article aria-labelledby={`tactic-${tactic.id}`} style={{ paddingBottom: '24px' }}>
            <span
                style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: '#ff0033',
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '6px',
                }}
            >
                {tactic.id}
            </span>
            <h3
                id={`tactic-${tactic.id}`}
                style={{
                    margin: 0,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.02em',
                    marginBottom: '10px',
                }}
            >
                {tactic.name}
            </h3>
            <ul aria-label={`Techniques for ${tactic.name}`} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {tactic.items.map((item) => (
                    <li
                        key={item}
                        style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8rem',
                            color: '#666',
                            marginBottom: '4px',
                            paddingLeft: '12px',
                            position: 'relative',
                        }}
                    >
                        <span aria-hidden="true" style={{ position: 'absolute', left: 0, color: '#333' }}>•</span>
                        {item}
                    </li>
                ))}
            </ul>
        </article>
    );
}

// ─── Threat Analyst Articles (Sliding View) ──────────────────────────────────
const THREAT_ARTICLES = [
    {
        title: "The 'Living off the Land' Paradox",
        p1: "Modern attackers rarely use custom malware in the initial stages. Instead, they leverage native system binaries (LOLBins) like PowerShell or CertUtil to bypass traditional EDR signatures.",
        promptColor: "#00aaff",
        promptText: "PROMPT: Explain LOLBas techniques in Windows environments.",
        p2: "By appearing as legitimate system processes, these tools evade detection. Understanding this pattern is critical for modern defenders building behavioral detection rules.",
    },
    {
        title: "The Rise of Initial Access Brokers",
        p1: "Ransomware operators increasingly rely on specialized groups known as Initial Access Brokers (IABs). These brokers compromise networks via stolen credentials or exposed RDP and sell the access.",
        promptColor: "#ffaa00",
        promptText: "PROMPT: Detail the business model of Initial Access Brokers.",
        p2: "This specialization allows ransomware gangs to focus purely on encryption and extortion, significantly reducing the time from initial breach to organization-wide impact.",
    },
    {
        title: "Supply Chain Compromise Vectors",
        p1: "Adversaries target software vendors to inject malicious code into trusted applications. Once an update is pushed, the malware inherits the trust and privileges of the compromised application.",
        promptColor: "#ff0033",
        promptText: "PROMPT: Analyze recent software supply chain attack patterns.",
        p2: "Defending against this requires strict zero-trust architectures, rigorous software bill of materials (SBOM) tracking, and continuous monitoring of outbound connections.",
    }
];

// ─── LandingPage ──────────────────────────────────────────────────────────────
export default function LandingPage() {
    const navigate = useNavigate();
    const [activePhase, setActivePhase] = useState(3); // EXPLOIT highlighted
    const [articleIndex, setArticleIndex] = useState(0); // Threat Analyst article slider
    const intervalRef = useRef(null);
    const articleIntervalRef = useRef(null);

    // Auto-cycle active phase
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setActivePhase((p) => (p + 1) % ATTACK_PHASES.length);
        }, 2000);
        return () => clearInterval(intervalRef.current);
    }, []);

    // Auto-cycle threat analyst articles
    useEffect(() => {
        articleIntervalRef.current = setInterval(() => {
            setArticleIndex((i) => (i + 1) % THREAT_ARTICLES.length);
        }, 15000);
        return () => clearInterval(articleIntervalRef.current);
    }, []);

    const W = { maxWidth: '1400px', margin: '0 auto', padding: '0 32px' };

    const schemaOrg = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://explainthehacker.cyberedt.com/#website",
                "url": "https://explainthehacker.cyberedt.com/",
                "name": "Explain The Hacker",
                "description": "Attacker Intelligence Platform developed by CyberEDT.",
                "publisher": { "@id": "https://explainthehacker.cyberedt.com/#organization" }
            },
            {
                "@type": "Organization",
                "@id": "https://explainthehacker.cyberedt.com/#organization",
                "name": "CyberEDT",
                "url": "https://www.cyberedt.com/",
                "logo": "https://explainthehacker.cyberedt.com/favicon.png",
                "sameAs": [
                    "https://github.com/CyberEDT"
                ]
            },
            {
                "@type": "SoftwareApplication",
                "@id": "https://explainthehacker.cyberedt.com/#software",
                "name": "Explain The Hacker",
                "applicationCategory": "SecurityApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0"
                },
                "author": { "@id": "https://explainthehacker.cyberedt.com/#organization" }
            }
        ]
    };

    return (
        <div style={{ background: '#000', color: '#fff', flex: 1 }}>
            <SEO 
                title="ETH (Explain The Hacker)" 
                description="Explain The Hacker by CyberEDT is an advanced interactive cybersecurity tool to simulate and understand real-world attack chains. Visualize threats, analyze tactics, and learn how hackers think."
                canonicalUrl="/"
                schema={schemaOrg}
            />

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section
                aria-labelledby="hero-heading"
                style={{
                    padding: '80px 0 0',
                    position: 'relative',
                    minHeight: '520px',
                    background: 'radial-gradient(circle at top center, #1a0005 0%, #000 80%)',
                    overflow: 'hidden'
                }}
            >
                {/* Subtle Grid Background */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'linear-gradient(rgba(255, 0, 51, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 51, 0.04) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    backgroundPosition: 'center top',
                    zIndex: 0,
                }} />

                <div style={{ ...W, position: 'relative', zIndex: 1, paddingBottom: '60px' }}>
                <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
                    {/* Left: Headline */}
                    <div style={{ flex: 1 }}>
                        <p
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.65rem',
                                color: '#444',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                marginBottom: '24px',
                            }}
                        >
                            MITRE ATT&CK THREAT SIMULATION
                        </p>

                        <h1
                            id="hero-heading"
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(48px, 12vw, 128px)',
                                lineHeight: 0.88,
                                color: '#fff',
                                margin: 0,
                                wordBreak: 'break-word',
                            }}
                        >
                            VISUALIZING
                            <br />
                            THE{' '}
                            <span style={{ color: '#ff0033' }}>KILL</span>
                            <br />
                            <span style={{ color: '#ff0033' }}>CHAIN</span>
                        </h1>

                        <p
                            style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.9rem',
                                color: '#666',
                                maxWidth: '420px',
                                lineHeight: 1.65,
                                marginTop: '32px',
                            }}
                        >
                            A technical deep-dive into adversary methodologies. From initial access
                            to final impact, we dissect the mechanics of modern cyber exploitation.
                        </p>
                    </div>

                    {/* Right: Status panel & CTA */}
                    <div className="flex flex-col items-start lg:items-end lg:justify-between self-stretch lg:min-h-[360px] w-full lg:w-auto">
                        <div
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.62rem',
                                letterSpacing: '0.1em',
                                textAlign: 'right',
                                flexShrink: 0,
                                paddingTop: '4px',
                            }}
                        >
                            {[
                                { dot: '#00ff9d', text: 'STATUS: OPERATIONAL' },
                                { dot: '#ff0033', text: 'THREATS: 1,204' },
                                { dot: '#ffaa00', text: 'V.1.0.0' },
                            ].map(({ dot, text }) => (
                                <div key={text} className="flex items-center justify-start lg:justify-end gap-2 mb-2">
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block', flexShrink: 0, animation: 'pulse-dot 2s ease-in-out infinite' }} />
                                    <span style={{ color: '#555' }}>{text}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate('/lab')}
                            className="mt-12 lg:mt-0"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                padding: '16px 36px',
                                background: '#ffffff',
                                color: '#000000',
                                border: '1px solid #ffffff',
                                cursor: 'pointer',
                                transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                        >
                            INITIALIZE_LABS
                        </button>
                    </div>
                </div>
                </div>
            </section>

            {/* ── LIVE ATTACK CHAIN VISUALIZATION ──────────────────────────────── */}
            <section id="killchain" style={{ ...W, padding: '48px 32px', borderBottom: '1px solid #111' }}>
                {/* Section label */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="terminal-label" style={{ marginBottom: '8px' }}>LIVE ATTACK CHAIN VISUALIZATION</div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#555', letterSpacing: '0.08em' }}>
                            Scenario: Advanced Persistent Threat (APT-41)
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/killchain')}
                        style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fff', background: '#ff0033', border: 'none', padding: '10px 20px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, transition: 'background 0.2s',
                            wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center', width: '100%', maxWidth: '400px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#d4002a'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#ff0033'}
                    >
                        EXPLORE INTERACTIVE KILL CHAIN →
                    </button>
                </div>

                {/* 7 phase cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-y-4 lg:gap-y-0 items-stretch">
                    {ATTACK_PHASES.map((phase, i) => (
                        <div
                            key={phase.num}
                            className="flex lg:border-r lg:border-[#1a1a1a] lg:pr-5 lg:pl-5 first:pl-0 last:pr-0 last:border-r-0"
                        >
                            <PhaseCard phase={phase} isActive={activePhase === i} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TACTICS GRID + ARTICLE ───────────────────────────────────── */}
            <section id="tactics" style={{ borderBottom: '1px solid #111' }}>
                <div style={W} className="py-16 grid grid-cols-1 lg:grid-cols-[1fr_1px_420px] gap-12">

                    {/* Left: Tactics grid */}
                    <div>
                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(40px, 5vw, 56px)',
                                color: '#fff',
                                lineHeight: 0.95,
                                marginBottom: '8px',
                            }}
                        >
                            TACTICS GRID
                        </h2>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#444' }}>
                                MITRE ATT&CK Framework Alignment
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate('/tactics')}
                                    style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#fff', background: '#ff0033', border: 'none', padding: '5px 12px', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'background 0.2s',
                                        wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#d4002a'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#ff0033'}
                                >
                                    EXPLORE ENTERPRISE TACTICS →
                                </button>
                                <a
                                    href="/matrix.csv"
                                    download="matrix.csv"
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.62rem',
                                        color: '#555',
                                        background: 'transparent',
                                        border: '1px solid #2a2a2a',
                                        padding: '5px 12px',
                                        cursor: 'pointer',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'none',
                                        display: 'inline-block',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555'; }}
                                >
                                    DOWNLOAD_MATRIX.CSV
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-[#1a1a1a]">
                            {TACTICS.map((tactic) => (
                                    <div
                                        key={tactic.id}
                                        className="lg:border-r lg:border-b lg:border-[#1a1a1a] lg:p-8 [&:nth-child(3n)]:border-r-0 [&:nth-last-child(-n+3)]:border-b-0 py-6 lg:py-8"
                                    >
                                    <TacticCell tactic={tactic} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Middle: Separator */}
                    <div style={{ background: '#1a1a1a' }} />

                    {/* Right: Threat Analyst article */}
                    <div>
                        <div
                            style={{
                                background: 'rgba(255,0,51,0.08)',
                                border: '1px solid rgba(255,0,51,0.2)',
                                padding: '24px',
                            }}
                        >
                            {/* Badge */}
                            <span
                                style={{
                                    display: 'inline-block',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.6rem',
                                    fontWeight: 700,
                                    color: '#000',
                                    background: '#ff0033',
                                    padding: '3px 10px',
                                    letterSpacing: '0.1em',
                                    marginBottom: '20px',
                                    textTransform: 'uppercase',
                                }}
                            >
                                AT THREAT ANALYST
                            </span>

                            <div key={articleIndex} style={{ animation: 'fadeIn 0.5s ease', height: '360px', display: 'flex', flexDirection: 'column' }}>
                                <h3
                                    style={{
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        color: '#fff',
                                        lineHeight: 1.3,
                                        marginBottom: '16px',
                                    }}
                                >
                                    {THREAT_ARTICLES[articleIndex].title}
                                </h3>

                                <p
                                    style={{
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.85rem',
                                        color: '#666',
                                        lineHeight: 1.65,
                                        marginBottom: '20px',
                                    }}
                                >
                                    {THREAT_ARTICLES[articleIndex].p1}
                                </p>

                                {/* Terminal prompt block */}
                                <div
                                    style={{
                                        background: '#050505',
                                        border: '1px solid #1a1a1a',
                                        borderLeft: `2px solid ${THREAT_ARTICLES[articleIndex].promptColor}`,
                                        padding: '12px 16px',
                                        marginBottom: '20px',
                                    }}
                                >
                                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: THREAT_ARTICLES[articleIndex].promptColor, letterSpacing: '0.04em', lineHeight: 1.5 }}>
                                        {THREAT_ARTICLES[articleIndex].promptText}
                                    </p>
                                </div>

                                <p
                                    style={{
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.85rem',
                                        color: '#555',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {THREAT_ARTICLES[articleIndex].p2}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VALUE PROPOSITION ─────────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid #111', background: '#030303', padding: '100px 0' }}>
                <div style={W}>
                    <div className="mb-16">
                        <div className="terminal-label" style={{ color: '#00aaff' }}>WHY ETH?</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 text-left">
                        <div className="flex flex-col items-start border-b md:border-b-0 md:border-r border-[#1a1a1a] pb-12 md:pb-0 md:pr-12 lg:pr-16">
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#ff0033', marginBottom: '16px' }}>01</div>
                            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Raw Data to Intelligence</h3>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#888', lineHeight: 1.6 }}>Feed the engine raw access logs, syslog data, or exposed ports. ETH correlates these disparate signals into actionable intelligence.</p>
                        </div>
                        <div className="flex flex-col items-start border-b md:border-b-0 md:border-r border-[#1a1a1a] pb-12 md:pb-0 md:pr-12 lg:pr-16">
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#ff0033', marginBottom: '16px' }}>02</div>
                            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Predictive Threat Modeling</h3>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#888', lineHeight: 1.6 }}>Don't just see what happened—see what will happen next. ETH maps your vulnerabilities to the full Cyber Kill Chain to predict adversary movement.</p>
                        </div>
                        <div className="flex flex-col items-start">
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#ff0033', marginBottom: '16px' }}>03</div>
                            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Analyst-Grade Reporting</h3>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#888', lineHeight: 1.6 }}>Receive standardized reporting aligned strictly with the MITRE ATT&CK framework, separating hard evidence from hypothetical risks.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── NETWORK GRAPH SECTION ────────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid #111' }}>
                <div style={W} className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text */}
                    <div>
                        <p
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.65rem',
                                color: '#ff0033',
                                letterSpacing: '0.18em',
                                marginBottom: '20px',
                                textTransform: 'uppercase',
                            }}
                        >
                            READY_FOR_ACTION
                        </p>
                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(40px, 5vw, 64px)',
                                color: '#fff',
                                lineHeight: 0.95,
                                marginBottom: '40px',
                            }}
                        >
                            ANALYZE YOUR ATTACK SURFACE
                        </h2>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#555', lineHeight: 1.6, maxWidth: '400px' }}>
                            Input exposed ports, misconfigurations, and raw logs. Get a full
                            MITRE ATT&CK kill-chain simulation with IOC mapping and actionable
                            mitigations — instantly.
                        </p>
                    </div>

                    {/* Right: Network graph visualization */}
                    <NetworkGraph />
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────────────── */}
            <section style={{ textAlign: 'center', padding: '100px 32px 80px' }}>
                <p
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        color: '#ff0033',
                        letterSpacing: '0.2em',
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                    }}
                >
                    READY_FOR_ACTION
                </p>
                <h2
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(48px, 8vw, 88px)',
                        color: '#fff',
                        lineHeight: 0.95,
                        marginBottom: '48px',
                    }}
                >
                    START YOUR SIMULATION
                </h2>

                <div style={{ display: 'flex', gap: '0', justifyContent: 'center' }}>
                    {/* INITIALIZE_LABS — launches the tool */}
                    <button
                        id="initialize-labs-btn"
                        onClick={() => navigate('/lab')}
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            padding: '16px 36px',
                            background: '#ffffff',
                            color: '#000000',
                            border: '1px solid #ffffff',
                            cursor: 'pointer',
                            transition: 'background 0.15s, color 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                    >
                        INITIALIZE_LABS
                    </button>

                    {/* GIT_CLONE */}
                    <button
                        id="git-clone-btn"
                        onClick={() => window.open('https://github.com/CyberEDT/Explain_the_Hacker', '_blank', 'noopener,noreferrer')}
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            padding: '16px 36px',
                            background: '#000',
                            color: '#fff',
                            border: '1px solid #2a2a2a',
                            cursor: 'pointer',
                            transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#555')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                    >
                        GIT_CLONE
                    </button>
                </div>
            </section>

        </div>
    );
}

// ─── Network Graph SVG (pure CSS, no library) ─────────────────────────────────
function NetworkGraph() {
    const nodes = [
        { id: 'DATA', x: 50, y: 50, r: 20, main: true },
        { id: 'WEB', x: 20, y: 20 }, { id: 'DB', x: 80, y: 15 },
        { id: 'API', x: 85, y: 50 }, { id: 'SSH', x: 80, y: 82 },
        { id: 'FTP', x: 50, y: 88 }, { id: 'RDP', x: 18, y: 80 },
        { id: 'DNS', x: 15, y: 50 }, { id: 'SMB', x: 25, y: 65 },
        { id: 'LDAP', x: 70, y: 28 }, { id: 'HTTP', x: 35, y: 18 },
    ];
    const center = nodes[0];

    return (
        <div
            style={{
                background: '#050505',
                border: '1px solid #1a1a1a',
                padding: '24px',
                position: 'relative',
                aspectRatio: '4/3',
                overflow: 'hidden',
            }}
        >
            {/* Subtle background glow for the container */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(255,0,51,0.05) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <svg
                viewBox="0 0 100 100"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
                aria-label="Network attack graph visualization"
            >
                <style>
                    {`
                        @keyframes pulse-glow {
                            0% { filter: drop-shadow(0 0 2px rgba(255,0,51,0.3)); }
                            50% { filter: drop-shadow(0 0 10px rgba(255,0,51,0.8)); }
                            100% { filter: drop-shadow(0 0 2px rgba(255,0,51,0.3)); }
                        }
                        @keyframes data-flow {
                            from { stroke-dashoffset: 10; }
                            to { stroke-dashoffset: 0; }
                        }
                        .satellite-node {
                            transition: all 0.3s ease;
                            cursor: crosshair;
                        }
                        .satellite-node rect {
                            transition: all 0.3s ease;
                        }
                        .satellite-node text {
                            transition: all 0.3s ease;
                        }
                        .satellite-node:hover rect {
                            stroke: #ff0033;
                            fill: #1a0005;
                            transform: scale(1.05);
                            transform-origin: center;
                        }
                        .satellite-node:hover text {
                            fill: #fff;
                        }
                    `}
                </style>

                {/* Base Edges */}
                {nodes.slice(1).map((node) => (
                    <line
                        key={`base-${node.id}`}
                        x1={center.x} y1={center.y}
                        x2={node.x} y2={node.y}
                        stroke="#ff0033"
                        strokeWidth="0.1"
                        strokeOpacity="0.2"
                    />
                ))}

                {/* Animated Data Flow Edges */}
                {nodes.slice(1).map((node, i) => (
                    <line
                        key={`flow-${node.id}`}
                        x1={node.x} y1={node.y}
                        x2={center.x} y2={center.y}
                        stroke="#ff0033"
                        strokeWidth="0.3"
                        strokeOpacity="0.8"
                        strokeDasharray="1 3"
                        style={{
                            animation: `data-flow ${1 + (i % 3) * 0.4}s linear infinite`
                        }}
                    />
                ))}

                {/* Satellite nodes */}
                {nodes.slice(1).map((node) => (
                    <g key={node.id} className="satellite-node" style={{ transformOrigin: `${node.x}px ${node.y}px` }}>
                        <rect
                            x={node.x - 7} y={node.y - 4}
                            width={14} height={8}
                            rx={1}
                            fill="#0a0a0a"
                            stroke="#333"
                            strokeWidth="0.4"
                        />
                        <text
                            x={node.x} y={node.y + 1.2}
                            textAnchor="middle"
                            fill="#888"
                            fontSize="3"
                            fontFamily="var(--font-mono)"
                            letterSpacing="0.05em"
                        >
                            {node.id}
                        </text>
                    </g>
                ))}

                {/* Center node — DATA */}
                <g style={{ animation: 'pulse-glow 3s infinite', transformOrigin: `${center.x}px ${center.y}px` }}>
                    <circle cx={center.x} cy={center.y} r={11} fill="#050001" stroke="#ff0033" strokeWidth="0.6" />
                    <circle cx={center.x} cy={center.y} r={9} fill="transparent" stroke="#ff0033" strokeWidth="0.2" strokeOpacity="0.5" strokeDasharray="1 1" />
                    <text x={center.x} y={center.y + 1.5} textAnchor="middle" fill="#ff0033" fontSize="4.5" fontFamily="var(--font-mono)" fontWeight="bold" letterSpacing="0.1em">
                        DATA
                    </text>
                </g>
            </svg>
        </div>
    );
}
