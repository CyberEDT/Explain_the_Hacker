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

// ─── Attack Chain Phases ──────────────────────────────────────────────────────
const ATTACK_PHASES = [
    {
        num: '01', label: 'RECON',
        color: '#00aaff',
        lines: ['PORT_SCAN ACTIVE', '> nmap -sV 192.168.1.0/24', 'HOST_DISCOVERY: 14 found'],
        barWidth: '60%',
    },
    {
        num: '02', label: 'WEAPONIZE',
        color: '#ffaa00',
        lines: ['PAYLOAD: COBALT_STRIKE.EXE', 'TARGET: HR_DEPT', 'SENT: [OK]'],
    },
    {
        num: '03', label: 'DELIVER',
        color: '#ffaa00',
        lines: ['PHISHING_MAIL_INIT...', 'TARGET: HR_DEPT', 'DELIVER_METHOD: EMAIL'],
    },
    {
        num: '04', label: 'EXPLOIT',
        color: '#ff0033',
        bg: 'rgba(255,0,51,0.15)',
        lines: ['CVE-2023-4822', 'EXECUTION_SUCCESSFUL', '> shell spawned'],
        isCritical: true,
    },
    {
        num: '05', label: 'INSTALL',
        color: '#ffaa00',
        lines: ['REGISTRY_KEY_ADDED', '> HKLM\\Run\\svchost32', 'PERSISTENCE: OK'],
    },
    {
        num: '06', label: 'C2',
        color: '#00ff9d',
        lines: ['HANDSHAKE_ESTABLISHED', '> beacon interval: 60s', 'CHANNEL: HTTPS/443'],
    },
    {
        num: '07', label: 'IMPACT',
        color: '#ff0033',
        isDashed: true,
        lines: ['DATA_EXFILTRATION', '> 2.4GB transferred', 'DEST: 185.220.101.x'],
    },
];

// ─── MITRE Tactics ────────────────────────────────────────────────────────────
const TACTICS = [
    {
        id: 'TA0001', name: 'INITIAL ACCESS',
        items: ['Phishing', 'Public-Facing Apps', 'Trusted Relationship'],
    },
    {
        id: 'TA0002', name: 'EXECUTION',
        items: ['Command Interpreter', 'Task Scheduling', 'User Execution'],
    },
    {
        id: 'TA0003', name: 'PERSISTENCE',
        items: ['Boot Logon Auto-start', 'Account Manipulation', 'Browser Extensions'],
    },
    {
        id: 'TA0004', name: 'PRIVILEGE ESCALATION',
        items: ['Token Manipulation', 'Bypass UAC', 'Sudo Abuse'],
    },
    {
        id: 'TA0005', name: 'DEFENSE EVASION',
        items: ['Obfuscated Files', 'Indicator Removal', 'Masquerading'],
    },
    {
        id: 'TA0006', name: 'CREDENTIAL ACCESS',
        items: ['Brute Force', 'OS Credential Dumping', 'Keylogging'],
    },
];

// ─── Phase Card ───────────────────────────────────────────────────────────────
function PhaseCard({ phase }) {
    return (
        <div
            style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
            }}
        >
            {/* Phase number + label */}
            <div style={{ marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', letterSpacing: '0.08em' }}>
                    {phase.num}
                </span>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
                    {phase.label}
                </p>
            </div>

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
                    <div style={{ height: '2px', background: phase.color, width: phase.barWidth, marginBottom: '8px' }} />
                )}

                {phase.lines.map((line, i) => (
                    <p
                        key={i}
                        style={{
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
        </div>
    );
}

// ─── Tactic Cell ─────────────────────────────────────────────────────────────
function TacticCell({ tactic }) {
    return (
        <div style={{ paddingBottom: '24px' }}>
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
            <p
                style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.02em',
                    marginBottom: '10px',
                }}
            >
                {tactic.name}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
                        <span style={{ position: 'absolute', left: 0, color: '#333' }}>•</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
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

    return (
        <div style={{ background: '#000', color: '#fff', flex: 1 }}>

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section
                style={{
                    ...W,
                    padding: '80px 32px 0',
                    position: 'relative',
                    minHeight: '520px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
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
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(72px, 10vw, 128px)',
                                lineHeight: 0.88,
                                color: '#fff',
                                margin: 0,
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

                    {/* Right: Status panel */}
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
                            <div key={text} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block', flexShrink: 0, animation: 'pulse-dot 2s ease-in-out infinite' }} />
                                <span style={{ color: '#555' }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

            {/* ── LIVE ATTACK CHAIN VISUALIZATION ──────────────────────────────── */}
            <section id="killchain" style={{ ...W, padding: '48px 32px', borderBottom: '1px solid #111' }}>
                {/* Section label */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div className="terminal-label">LIVE ATTACK CHAIN VISUALIZATION</div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#333', letterSpacing: '0.08em' }}>
                        Scenario: Advanced Persistent Threat (APT-41)
                    </span>
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#444' }}>
                                MITRE ATT&CK Framework Alignment
                            </p>
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
            }}
        >
            <svg
                viewBox="0 0 100 100"
                style={{ width: '100%', height: '100%' }}
                aria-label="Network attack graph visualization"
            >
                {/* Edges from center to each satellite */}
                {nodes.slice(1).map((node) => (
                    <line
                        key={node.id}
                        x1={center.x} y1={center.y}
                        x2={node.x} y2={node.y}
                        stroke="#ff0033"
                        strokeWidth="0.3"
                        strokeOpacity="0.5"
                    />
                ))}

                {/* Satellite nodes */}
                {nodes.slice(1).map((node) => (
                    <g key={node.id}>
                        <rect
                            x={node.x - 6} y={node.y - 3.5}
                            width={12} height={7}
                            fill="#0a0a0a"
                            stroke="#2a2a2a"
                            strokeWidth="0.4"
                        />
                        <text
                            x={node.x} y={node.y + 1.2}
                            textAnchor="middle"
                            fill="#555"
                            fontSize="3"
                            fontFamily="JetBrains Mono, monospace"
                        >
                            {node.id}
                        </text>
                    </g>
                ))}

                {/* Center node — DATA */}
                <circle cx={center.x} cy={center.y} r={10} fill="#0a0a0a" stroke="#ff0033" strokeWidth="0.5" />
                <text x={center.x} y={center.y + 1.5} textAnchor="middle" fill="#ff0033" fontSize="4" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                    DATA
                </text>
            </svg>
        </div>
    );
}
