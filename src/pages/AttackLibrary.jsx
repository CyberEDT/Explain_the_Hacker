/**
 * AttackLibrary.jsx â€” ETH Attack Combination Library
 * Route: /library
 *
 * Educational flagship page teaching how attackers combine
 * ports + services + misconfigurations into attack paths.
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Shield, AlertTriangle, Zap, Target, Crosshair, Map, Activity, ShieldAlert, BrainCircuit, TerminalSquare, Eye, Lock, Globe, Server, Database, Network } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Area, AreaChart, CartesianGrid, Legend } from 'recharts';
import { mitreIntelligenceData } from '../data/mitreIntelligenceData.js';
import ChartExplainer from '../components/ChartExplainer';
import SEO from '@/components/SEO';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DESIGN TOKENS (match ETH exactly)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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
    muted:  '#444444',
    sec:    '#888888',
    mono:   'var(--font-mono)',
    sans:   'var(--font-sans)',
    disp:   'var(--font-display)',
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// COMBINATION DATABASE â€” 48 entries
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
import { COMBOS } from '../data/attackCombinationsData.js';
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// HELPER UTILITIES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const TIER_COLOR  = { beginner: T.green, intermediate: T.amber, advanced: T.red };
const INTEREST_COLOR = (s) => s >= 80 ? T.red : s >= 60 ? T.amber : s >= 40 ? T.blue : T.green;
const TIER_LABEL = { beginner:'BEGINNER', intermediate:'INTERMEDIATE', advanced:'ADVANCED' };

function InterestBar({ score }) {
    const color = INTEREST_COLOR(score);
    const blocks = Math.round(score / 10);
    return (
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ display:'flex', gap:'2px' }}>
                {Array.from({length:10}).map((_,i) => (
                    <div key={i} style={{
                        width:'6px', height:'10px',
                        background: i < blocks ? color : T.s3,
                        transition:'background 0.3s',
                    }}/>
                ))}
            </div>
            <span style={{ fontFamily:T.mono, fontSize:'0.55rem', color, letterSpacing:'0.08em' }}>
                {score >= 90 ? 'CRITICAL' : score >= 70 ? 'HIGH' : score >= 50 ? 'MEDIUM' : 'LOW'}
            </span>
        </div>
    );
}

function TierBadge({ tier }) {
    const c = TIER_COLOR[tier];
    return (
        <span style={{
            fontFamily:T.mono, fontSize:'0.5rem', fontWeight:700,
            color:c, border:`1px solid ${c}33`,
            background:`${c}11`, padding:'2px 7px', letterSpacing:'0.12em',
        }}>
            {TIER_LABEL[tier]}
        </span>
    );
}

function ObjectivePill({ label }) {
    return (
        <span style={{
            fontFamily:T.mono, fontSize:'0.52rem', color:T.blue,
            border:'1px solid rgba(0,170,255,0.25)', background:'rgba(0,170,255,0.05)',
            padding:'2px 7px', letterSpacing:'0.06em', whiteSpace:'nowrap',
        }}>{label}</span>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// HERO SECTION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function LibraryHero({ onScrollToGrid }) {
    const totalCombos   = COMBOS.length;
    const beginnerCount = COMBOS.filter(c => c.tier === 'beginner').length;
    const intCount      = COMBOS.filter(c => c.tier === 'intermediate').length;
    const advCount      = COMBOS.filter(c => c.tier === 'advanced').length;
    const techniqueSet  = new Set(COMBOS.flatMap(c => c.mitreTechniques.map(t => t.id)));

    return (
        <section style={{
            borderBottom:`1px solid ${T.border}`,
            background:'radial-gradient(ellipse at 50% 0%, #1a0505 0%, #000 65%)',
            paddingTop:'48px', paddingBottom:'48px',
        }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px' }}>
                {/* Terminal label */}
                <div style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.red, letterSpacing:'0.22em', marginBottom:'20px', textTransform:'uppercase' }}>
                    ADVERSARY KNOWLEDGE BASE
                </div>

                {/* Main title */}
                <h1 style={{
                    fontFamily:T.disp, fontSize:'clamp(32px,9vw,104px)',
                    lineHeight:0.88, textTransform:'uppercase',
                    marginBottom:'24px', letterSpacing:'-0.01em', wordBreak: 'break-word'
                }}>
                    <span style={{ color:T.white, display:'block' }}>ATTACK</span>
                    <span style={{ color:T.muted, display:'block' }}>COMBINATION</span>
                    <span style={{ color:T.red, display:'block' }}>LIBRARY</span>
                </h1>

                {/* Subtitle */}
                <p style={{ fontFamily:T.sans, fontSize:'1.05rem', color:'#aaa', lineHeight:1.65, maxWidth:'620px', marginBottom:'20px' }}>
                    Explore the most important service and misconfiguration combinations used by attackers in real-world environments. Learn how attackers think â€” not just what they do.
                </p>

                {/* Disclaimer */}
                <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', marginBottom:'36px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                    </svg>
                    <span style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.1em' }}>
                        EDUCATIONAL RESOURCE ONLY â€” NO EXPLOITATION GUIDANCE PROVIDED
                    </span>
                </div>

                {/* Stat bar */}
                <div style={{ display:'flex', gap:'1px', background:T.s3, width:'fit-content', flexWrap:'wrap' }}>
                    {[
                        { value: totalCombos,        label:'COMBINATIONS',       color:T.red   },
                        { value: beginnerCount,       label:'BEGINNER',           color:T.green },
                        { value: intCount,            label:'INTERMEDIATE',       color:T.amber },
                        { value: advCount,            label:'ADVANCED',           color:T.red   },
                        { value: techniqueSet.size,   label:'MITRE TECHNIQUES',   color:T.blue  },
                    ].map(({ value, label, color }) => (
                        <div key={label} style={{ background:T.bg, padding:'14px 20px', minWidth:'80px' }}>
                            <p style={{ fontFamily:T.disp, fontSize:'2rem', color, margin:0, lineHeight:1 }}>{value}</p>
                            <p style={{ fontFamily:T.mono, fontSize:'0.5rem', color:T.muted, letterSpacing:'0.15em', marginTop:'5px', textTransform:'uppercase' }}>{label}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ marginTop:'32px' }}>
                    <button onClick={onScrollToGrid} style={{
                        fontFamily:T.mono, fontSize:'0.7rem', fontWeight:700,
                        letterSpacing:'0.14em', textTransform:'uppercase',
                        background:T.red, color:T.white, border:'none', cursor:'pointer',
                        padding:'13px 28px', transition:'background 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background='#cc0028'}
                        onMouseLeave={e => e.currentTarget.style.background=T.red}
                    >
                        EXPLORE LIBRARY â†’
                    </button>
                </div>
            </div>
        </section>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// LEARNING PATH NAVIGATOR
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function LearningPathNavigator({ onFilter }) {
    const paths = [
        {
            tier:'beginner', color:T.green,
            time:'~45 min', who:'Security students, sysadmins, IT professionals',
            desc:'No prior attacker knowledge needed. Covers the foundational misconfigurations every defender must understand.',
            examples:['SMB Anonymous Access','FTP Anonymous Login','HTTP Default Credentials','RDP Weak Passwords','Redis No Auth'],
        },
        {
            tier:'intermediate', color:T.amber,
            time:'~90 min', who:'Security engineers, junior penetration testers',
            desc:'Requires basic networking knowledge. Covers protocol-level attacks and Active Directory fundamentals.',
            examples:['SMBv1 + EternalBlue','LDAP Anonymous Bind','Jenkins Script Console','Docker API Exposure','NTLM Relay'],
        },
        {
            tier:'advanced', color:T.red,
            time:'~2â€“3 hrs', who:'Penetration testers, red teamers, incident responders',
            desc:'Requires Active Directory, cloud, and container knowledge. Covers sophisticated multi-stage attack chains.',
            examples:['Kerberoasting','Unconstrained Delegation','Ransomware Kill Chain','SSRF to Cloud Takeover','DNS Tunneling C2'],
        },
    ];

    return (
        <section style={{ borderBottom:`1px solid ${T.border}`, background:T.s1, padding:'48px 0' }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px' }}>
                <div style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.2em', marginBottom:'8px', textTransform:'uppercase' }}>LEARNING PATH NAVIGATOR</div>
                <h2 style={{ fontFamily:T.disp, fontSize:'2.4rem', textTransform:'uppercase', marginBottom:'32px', lineHeight:1 }}>
                    WHERE DO YOU START?
                </h2>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1px', background:T.s3 }}>
                    {paths.map(({ tier, color, time, who, desc, examples }) => (
                        <div key={tier} style={{ background:T.bg, borderTop:`3px solid ${color}`, padding:'28px' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                                <span style={{ fontFamily:T.disp, fontSize:'1.8rem', color, textTransform:'uppercase' }}>{tier}</span>
                                <span style={{ fontFamily:T.mono, fontSize:'0.55rem', color:T.muted }}>{time}</span>
                            </div>
                            <p style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.muted, marginBottom:'12px', letterSpacing:'0.06em' }}>
                                Best for: {who}
                            </p>
                            <p style={{ fontFamily:T.sans, fontSize:'0.88rem', color:'#999', lineHeight:1.6, marginBottom:'18px' }}>{desc}</p>
                            <div style={{ display:'flex', flexDirection:'column', gap:'4px', marginBottom:'20px' }}>
                                {examples.map(ex => (
                                    <div key={ex} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                                        <div style={{ width:'4px', height:'4px', background:color, flexShrink:0 }}/>
                                        <span style={{ fontFamily:T.sans, fontSize:'0.82rem', color:'#888' }}>{ex}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => onFilter(tier)} style={{
                                fontFamily:T.mono, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
                                background:'none', border:`1px solid ${color}`, color, cursor:'pointer',
                                padding:'9px 18px', width:'100%', transition:'all 0.15s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background=color; e.currentTarget.style.color='#000'; }}
                                onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color=color; }}
                            >
                                START {TIER_LABEL[tier]} PATH â†’
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SEARCH & FILTER BAR
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function SearchFilterBar({ search, setSearch, activeTier, setActiveTier, activeObjective, setActiveObjective, resultCount }) {
    const objectives = ['Initial Access','Credential Access','Discovery','Lateral Movement','Collection','Persistence','Impact','C2','Exfiltration'];

    return (
        <div style={{ position:'sticky', top:'56px', zIndex:40, background:'#000', borderBottom:`1px solid ${T.s3}`, padding:'12px 0' }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px', display:'flex', flexWrap:'wrap', gap:'8px', alignItems:'center' }}>
                {/* Search */}
                <div style={{ position:'relative', flex:'1', minWidth:'200px' }}>
                    <svg style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search combinations, services, techniques..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width:'100%', background:T.s1, border:`1px solid ${T.border}`,
                            color:'#fff', fontFamily:T.mono, fontSize:'0.72rem', padding:'8px 10px 8px 30px',
                            outline:'none', letterSpacing:'0.04em',
                        }}
                    />
                </div>

                {/* Tier filters */}
                {['all','beginner','intermediate','advanced'].map(t => (
                    <button key={t} onClick={() => setActiveTier(t === activeTier ? 'all' : t)} style={{
                        fontFamily:T.mono, fontSize:'0.6rem', letterSpacing:'0.12em', textTransform:'uppercase',
                        padding:'7px 14px', border:'1px solid', cursor:'pointer', transition:'all 0.15s',
                        borderColor: t === 'all' ? (activeTier === 'all' ? '#fff' : T.muted) : TIER_COLOR[t] || T.muted,
                        background: activeTier === t ? (t === 'all' ? '#111' : `${TIER_COLOR[t]}22`) : 'transparent',
                        color: activeTier === t ? (t === 'all' ? '#fff' : TIER_COLOR[t]) : T.muted,
                    }}>
                        {t === 'all' ? 'ALL' : TIER_LABEL[t]}
                    </button>
                ))}

                {/* Objective filter */}
                <select
                    value={activeObjective}
                    onChange={e => setActiveObjective(e.target.value)}
                    style={{
                        background:T.s1, border:`1px solid ${T.border}`, color: activeObjective ? T.blue : T.muted,
                        fontFamily:T.mono, fontSize:'0.6rem', padding:'7px 10px', cursor:'pointer', outline:'none', letterSpacing:'0.08em',
                    }}
                >
                    <option value="">ALL OBJECTIVES</option>
                    {objectives.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                </select>

                {/* Result count */}
                <span style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, marginLeft:'auto', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>
                    {resultCount} combinations
                </span>

                {/* Clear */}
                {(search || activeTier !== 'all' || activeObjective) && (
                    <button onClick={() => { setSearch(''); setActiveTier('all'); setActiveObjective(''); }} style={{
                        fontFamily:T.mono, fontSize:'0.58rem', color:T.red, background:'none', border:`1px solid ${T.red}44`,
                        cursor:'pointer', padding:'5px 10px', letterSpacing:'0.1em',
                    }}>
                        CLEAR
                    </button>
                )}
            </div>
        </div>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// COMBINATION CARD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function ComboCard({ combo, onSelect, isSelected }) {
    const tierColor = TIER_COLOR[combo.tier];
    const [hov, setHov] = useState(false);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect(combo)}
            onKeyDown={e => e.key === 'Enter' && onSelect(combo)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background:T.s1, cursor:'pointer',
                borderLeft: isSelected ? `3px solid ${T.red}` : `3px solid transparent`,
                border: isSelected ? `1px solid rgba(255,0,51,0.4)` : `1px solid ${hov ? T.b2 : T.border}`,
                padding:'20px', display:'flex', flexDirection:'column', gap:'12px',
                transition:'all 0.15s',
                boxShadow: isSelected ? '0 0 0 1px rgba(255,0,51,0.2), 0 4px 20px rgba(255,0,51,0.08)' : hov ? '0 4px 20px rgba(0,0,0,0.4)' : 'none',
                outline:'none',
            }}
        >
            {/* Top bar */}
            <div style={{ height:'2px', background:tierColor, margin:'-20px -20px 0', marginBottom:'0' }}/>

            {/* Header row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px' }}>
                <span style={{ fontFamily:T.mono, fontSize:'0.52rem', color:T.muted, letterSpacing:'0.1em' }}>{combo.id}</span>
                <div style={{ display:'flex', gap:'5px', alignItems:'center' }}>
                    <span style={{
                        fontFamily:T.mono, fontSize:'0.5rem', color:INTEREST_COLOR(combo.interestScore),
                        border:`1px solid ${INTEREST_COLOR(combo.interestScore)}44`, padding:'2px 6px',
                    }}>
                        {combo.interestScore >= 80 ? 'CRITICAL' : combo.interestScore >= 60 ? 'HIGH' : 'MEDIUM'}
                    </span>
                    <span style={{ fontFamily:T.mono, fontSize:'0.52rem', color:T.blue, border:`1px solid ${T.blue}33`, padding:'2px 6px' }}>
                        :{combo.port}
                    </span>
                </div>
            </div>

            {/* Title */}
            <h3 style={{ fontFamily:T.disp, fontSize:'1.35rem', textTransform:'uppercase', margin:0, lineHeight:1.05, letterSpacing:'0.01em', color:T.white }}>
                {combo.name}
            </h3>

            {/* Tagline */}
            <p style={{ fontFamily:T.sans, fontSize:'0.82rem', color:'#777', margin:0, lineHeight:1.55, fontStyle:'italic' }}>
                {combo.tagline}
            </p>

            {/* Objectives */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                {combo.objectives.slice(0, 3).map(o => <ObjectivePill key={o} label={o} />)}
            </div>

            {/* MITRE */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                {combo.mitreTechniques.slice(0, 2).map(t => (
                    <span key={t.id} style={{ fontFamily:T.mono, fontSize:'0.5rem', color:T.muted, letterSpacing:'0.06em' }}>
                        {t.id}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'8px', borderTop:`1px solid ${T.border}` }}>
                <TierBadge tier={combo.tier} />
                <InterestBar score={combo.interestScore} />
            </div>

            {/* Explore button */}
            <div style={{
                fontFamily:T.mono, fontSize:'0.6rem', fontWeight:700, color: isSelected ? T.red : hov ? T.white : T.muted,
                letterSpacing:'0.12em', textAlign:'right', transition:'color 0.15s',
            }}>
                {isSelected ? 'â— VIEWING â†’' : 'EXPLORE SCENARIO â†’'}
            </div>
        </div>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SCENARIO SIMULATOR â€” TERMINAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function TerminalSession({ steps }) {
    const endRef = useRef(null);
    const [shown, setShown] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [prevSteps, setPrevSteps] = useState(steps);

    if (steps !== prevSteps) {
        setPrevSteps(steps);
        setShown(0);
        setPlaying(true);
    }

    useEffect(() => {
        if (!playing) return;
        if (shown >= steps.length) {
            const t = setTimeout(() => setPlaying(false), 0);
            return () => clearTimeout(t);
        }
        const delay = steps[shown]?.type === 'output' ? 600 : 400;
        const t = setTimeout(() => setShown(s => s + 1), delay);
        return () => clearTimeout(t);
    }, [shown, playing, steps]);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [shown]);

    return (
        <div style={{ background:'#050505', border:`1px solid ${T.s3}`, padding:'20px', fontFamily:T.mono, fontSize:'0.75rem', lineHeight:1.7, maxHeight:'420px', overflowY:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', paddingBottom:'10px', borderBottom:`1px solid ${T.s3}` }}>
                <span style={{ fontSize:'0.55rem', color:T.muted, letterSpacing:'0.15em' }}>ATTACKER TERMINAL SESSION</span>
                <button onClick={() => playing ? setPlaying(false) : (setShown(0), setPlaying(true))} style={{
                    fontFamily:T.mono, fontSize:'0.55rem', color:T.amber, background:'none',
                    border:`1px solid ${T.amber}44`, cursor:'pointer', padding:'3px 10px', letterSpacing:'0.1em',
                }}>
                    {playing ? 'â¸ PAUSE' : 'â†º REPLAY'}
                </button>
            </div>
            {steps.slice(0, shown).map((s, i) => (
                <div key={i} style={{ marginBottom:'8px' }}>
                    {s.type === 'command' && (
                        <div>
                            <span style={{ color:T.green }}>$ </span>
                            <span style={{ color:'#ddd' }}>{s.content}</span>
                            {s.annotation && (
                                <span style={{ color:T.muted, display:'block', marginLeft:'16px', fontSize:'0.65rem' }}>
                                    {'# '}{s.annotation}
                                </span>
                            )}
                        </div>
                    )}
                    {s.type === 'output' && (
                        <pre style={{ color:'#888', whiteSpace:'pre-wrap', margin:'2px 0 2px 16px', fontSize:'0.7rem' }}>{s.content}</pre>
                    )}
                    {s.type === 'annotation' && (
                        <div style={{ color:T.amber, borderLeft:`2px solid ${T.amber}`, paddingLeft:'10px', marginLeft:'8px', fontSize:'0.68rem', fontStyle:'italic' }}>
                            {s.content}
                        </div>
                    )}
                    {s.type === 'separator' && <div style={{ borderTop:`1px dashed ${T.s3}`, margin:'10px 0' }}/>}
                </div>
            ))}
            {shown < steps.length && playing && <span style={{ color:T.green, animation:'none' }}>â–ˆ</span>}
            <div ref={endRef}/>
        </div>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// KILL CHAIN VISUAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const KC_PHASES = ['Reconnaissance','Initial Access','Execution','Persistence','Privilege Escalation','Lateral Movement','Collection','C2','Exfiltration','Impact'];

function KillChainVisual({ combo }) {
    const active = new Set([combo.killChainStage, ...combo.objectives.map(o => {
        const m = { 'Initial Access':'Initial Access', 'Lateral Movement':'Lateral Movement', 'Collection':'Collection', 'Exfiltration':'Exfiltration', 'Impact':'Impact', 'Persistence':'Persistence', 'Privilege Escalation':'Privilege Escalation', 'C2':'C2', 'Discovery':'Reconnaissance', 'Credential Access':'Initial Access' };
        return m[o];
    }).filter(Boolean)]);

    return (
        <div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'24px' }}>
                {KC_PHASES.map((phase, i) => {
                    const isActive = active.has(phase);
                    const isEntry = phase === combo.killChainStage;
                    return (
                        <div key={phase} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                            <div style={{
                                background: isEntry ? T.red : isActive ? `${T.amber}22` : T.s2,
                                border: isEntry ? `1px solid ${T.red}` : isActive ? `1px solid ${T.amber}` : `1px solid ${T.border}`,
                                padding:'6px 12px',
                            }}>
                                <span style={{ fontFamily:T.mono, fontSize:'0.58rem', color: isEntry ? T.white : isActive ? T.amber : T.muted, fontWeight: isEntry ? 700 : 400, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                                    {phase}
                                </span>
                            </div>
                            {i < KC_PHASES.length - 1 && (
                                <span style={{ color: isActive ? T.amber : T.s3, fontSize:'0.7rem' }}>â†’</span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div style={{ background:T.s1, borderLeft:`2px solid ${T.red}`, padding:'12px 16px' }}>
                <p style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.red, letterSpacing:'0.12em', marginBottom:'4px' }}>ENTRY POINT</p>
                <p style={{ fontFamily:T.sans, fontSize:'0.88rem', color:'#aaa' }}>
                    This combination enters the kill chain at <strong style={{ color:T.white }}>{combo.killChainStage}</strong>.
                    The attacker's objectives span: {combo.objectives.join(' â†’ ')}.
                </p>
            </div>
        </div>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MITRE TAB
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function MitreTab({ combo }) {
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em' }}>TACTICS ACTIVATED</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'8px' }}>
                {combo.mitreTactics.map(t => (
                    <span key={t} style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.blue, border:`1px solid ${T.blue}44`, background:`${T.blue}0d`, padding:'4px 12px', letterSpacing:'0.08em' }}>
                        {t}
                    </span>
                ))}
            </div>
            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em' }}>TECHNIQUES MAPPED</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {combo.mitreTechniques.map(t => {
                    const baseId = t.id.split('.')[0];
                    const intel = mitreIntelligenceData[t.id] || mitreIntelligenceData[baseId];
                    return (
                    <div key={t.id} style={{ display:'flex', flexDirection:'column', gap:'8px', background:T.s2, padding:'14px', border:`1px solid ${T.border}` }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                            <span style={{ fontFamily:T.mono, fontSize:'0.65rem', color:T.red, fontWeight:700, flexShrink:0, minWidth:'80px' }}>{t.id}</span>
                            <span style={{ fontFamily:T.sans, fontSize:'0.85rem', color:'#ccc' }}>{intel?.['Technique Name'] || t.name}</span>
                            <a href={`https://attack.mitre.org/techniques/${t.id.replace('.','/')}`} target="_blank" rel="noreferrer"
                                style={{ marginLeft:'auto', fontFamily:T.mono, fontSize:'0.52rem', color:T.muted, textDecoration:'none', whiteSpace:'nowrap' }}
                                onMouseEnter={e => e.currentTarget.style.color=T.blue}
                                onMouseLeave={e => e.currentTarget.style.color=T.muted}
                            >
                                VIEW ON MITRE â†’
                            </a>
                        </div>
                        {intel && intel.Description && (
                            <div style={{ paddingLeft: '92px' }}>
                                <p style={{ fontFamily:T.sans, fontSize:'0.8rem', color:'#999', margin:0, lineHeight: 1.5 }}>
                                    {intel.Description}
                                </p>
                            </div>
                        )}
                    </div>
                )})}
            </div>
        </div>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DEFENDER TAB
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function DefenderTab({ combo }) {
    const pColor = { critical:T.red, high:T.amber, medium:T.blue };
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            <div style={{ background:T.s2, borderLeft:`2px solid ${T.green}`, padding:'10px 14px', marginBottom:'8px' }}>
                <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.green, letterSpacing:'0.12em', marginBottom:'4px' }}>LEARNING OBJECTIVE</p>
                <p style={{ fontFamily:T.sans, fontSize:'0.85rem', color:'#aaa', lineHeight:1.6 }}>{combo.learningObjective}</p>
            </div>
            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'4px' }}>REMEDIATION STEPS</p>
            {combo.defenderSteps.map((s, i) => {
                const c = pColor[s.priority] || T.muted;
                return (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px', background:T.s1, border:`1px solid ${T.border}`, padding:'12px 14px' }}>
                        <span style={{ fontFamily:T.mono, fontSize:'0.5rem', color:c, border:`1px solid ${c}`, padding:'2px 6px', flexShrink:0, marginTop:'2px', fontWeight:700, letterSpacing:'0.1em' }}>
                            {s.priority.toUpperCase()}
                        </span>
                        <code style={{ fontFamily:T.mono, fontSize:'0.72rem', color:'#bbb', lineHeight:1.55, wordBreak:'break-word' }}>{s.action}</code>
                    </div>
                );
            })}
        </div>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SCENARIO SIMULATOR PANEL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const TABS = ['OVERVIEW','ATTACKER THINKING','KILL CHAIN','MITRE','REAL WORLD','DEFENDER'];

function ScenarioPanel({ combo, onClose }) {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [prevComboId, setPrevComboId] = useState(combo?.id);

    if (combo?.id !== prevComboId) {
        setPrevComboId(combo?.id);
        setTab(0);
    }

    if (!combo) return null;

    return (
        <div style={{
            position:'sticky', top:'108px',
            background:T.bg, border:`1px solid ${T.b2}`,
            boxShadow:'0 0 0 1px rgba(255,0,51,0.15), 0 8px 40px rgba(0,0,0,0.6)',
            maxHeight:'calc(100vh - 130px)', overflowY:'auto',
            display:'flex', flexDirection:'column',
        }}>
            {/* Header */}
            <div style={{ padding:'20px 24px', borderBottom:`1px solid ${T.s3}`, background:T.s1, position:'sticky', top:0, zIndex:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                        <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'6px' }}>
                            <TierBadge tier={combo.tier} />
                            <span style={{ fontFamily:T.mono, fontSize:'0.52rem', color:T.muted }}>{combo.id}</span>
                        </div>
                        <h2 style={{ fontFamily:T.disp, fontSize:'1.6rem', textTransform:'uppercase', margin:0, lineHeight:1, color:T.white }}>{combo.name}</h2>
                        <p style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.muted, marginTop:'6px', letterSpacing:'0.08em' }}>
                            {combo.service} Â· Port {combo.port} Â· {combo.misconfig}
                        </p>
                    </div>
                    <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                        <button
                            onClick={() => navigate('/lab', { state: { presetCombo: combo } })}
                            style={{
                                background: T.red,
                                color: T.white,
                                border: 'none',
                                cursor: 'pointer',
                                padding: '6px 14px',
                                fontFamily: T.mono,
                                fontSize: '0.62rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            title="Simulate this combination in ETH Engine"
                        >
                            <Zap size={12} /> TEST IN LAB
                        </button>
                        <button onClick={onClose} style={{ background:'none', border:`1px solid ${T.s3}`, color:T.muted, cursor:'pointer', padding:'6px 10px', fontFamily:T.mono, fontSize:'0.6rem', letterSpacing:'0.1em' }}>✕ CLOSE</button>
                    </div>
                </div>
            </div>

            {/* Tab Nav */}
            <div style={{ display:'flex', gap:'1px', background:T.s3, borderBottom:`1px solid ${T.s3}`, overflowX:'auto', flexShrink:0 }}>
                {TABS.map((t, i) => (
                    <button key={t} onClick={() => setTab(i)} style={{
                        fontFamily:T.mono, fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
                        background: tab === i ? T.bg : T.s1, color: tab === i ? T.white : T.muted,
                        border:'none', borderBottom: tab === i ? `2px solid ${T.red}` : '2px solid transparent',
                        padding:'10px 14px', cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.12s',
                    }}>{t}</button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding:'24px', flex:1, overflowY:'auto' }}>
                {tab === 0 && (
                    <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
                        {/* Port + service visual */}
                        <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                            <span style={{ fontFamily:T.mono, fontSize:'0.65rem', color:T.blue, border:`1px solid ${T.blue}44`, background:`${T.blue}0d`, padding:'6px 14px' }}>PORT {combo.port}</span>
                            <span style={{ color:T.muted }}>+</span>
                            <span style={{ fontFamily:T.mono, fontSize:'0.65rem', color:T.white, border:`1px solid ${T.b2}`, background:T.s1, padding:'6px 14px' }}>{combo.service}</span>
                            <span style={{ color:T.muted }}>+</span>
                            <span style={{ fontFamily:T.mono, fontSize:'0.65rem', color:T.red, border:`1px solid ${T.red}44`, background:`${T.red}0d`, padding:'6px 14px' }}>{combo.misconfig}</span>
                        </div>

                        {/* Quote */}
                        <div style={{ borderLeft:`2px solid ${T.amber}`, padding:'10px 16px', background:`${T.amber}08` }}>
                            <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.amber, margin:0, fontStyle:'italic' }}>
                                {"// "}{combo.tagline}
                            </p>
                        </div>

                        <div>
                            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'8px' }}>WHAT IS THIS COMBINATION?</p>
                            <p style={{ fontFamily:T.sans, fontSize:'0.88rem', color:'#bbb', lineHeight:1.7 }}>{combo.overview}</p>
                        </div>
                        <div>
                            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'8px' }}>WHY ATTACKERS CARE</p>
                            <p style={{ fontFamily:T.sans, fontSize:'0.88rem', color:'#bbb', lineHeight:1.7 }}>{combo.whyAttackersCare}</p>
                        </div>
                        <div>
                            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'8px' }}>ATTACKER OBJECTIVES</p>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                                {combo.objectives.map(o => <ObjectivePill key={o} label={o} />)}
                            </div>
                        </div>
                        <div>
                            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'8px' }}>ATTACKER INTEREST</p>
                            <InterestBar score={combo.interestScore} />
                        </div>
                    </div>
                )}
                {tab === 1 && <TerminalSession steps={combo.terminal} />}
                {tab === 2 && <KillChainVisual combo={combo} />}
                {tab === 3 && <MitreTab combo={combo} />}
                {tab === 4 && (
                    <div>
                        <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'12px' }}>REAL-WORLD USAGE</p>
                        <p style={{ fontFamily:T.sans, fontSize:'0.88rem', color:'#bbb', lineHeight:1.75 }}>{combo.realWorld}</p>
                    </div>
                )}
                {tab === 5 && <DefenderTab combo={combo} />}
            </div>

            {/* Action Bar */}
            <div style={{
                padding: '14px 24px',
                borderTop: `1px solid ${T.s3}`,
                background: T.s1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
            }}>
                <span style={{ fontFamily: T.mono, fontSize: '0.6rem', color: T.sec }}>
                    Simulate this attack path in ETH Engine:
                </span>
                <button
                    onClick={() => navigate('/lab', { state: { presetCombo: combo } })}
                    style={{
                        background: T.red,
                        color: T.white,
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px 18px',
                        fontFamily: T.mono,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <Zap size={13} /> ANALYZE IN LAB →
                </button>
            </div>
        </div>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// RECHARTS VISUALIZATIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background:'#111', border:`1px solid ${T.b2}`, padding:'10px 14px' }}>
            <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.white, marginBottom:'4px' }}>{label || payload[0]?.payload?.name}</p>
            <p style={{ fontFamily:T.mono, fontSize:'0.65rem', color:INTEREST_COLOR(payload[0]?.value) }}>{payload[0]?.value}</p>
        </div>
    );
};

function VisualizationsSection() {
    const top12 = [...COMBOS].sort((a,b) => b.interestScore - a.interestScore).slice(0, 12);

    // Kill chain coverage data
    const kcCoverage = KC_PHASES.map(phase => {
        const count = COMBOS.filter(c => c.killChainStage === phase || c.objectives.some(o => {
            const m = { 'Initial Access':'Initial Access', 'Lateral Movement':'Lateral Movement', 'Collection':'Collection', 'Exfiltration':'Exfiltration', 'Impact':'Impact', 'Persistence':'Persistence', 'Privilege Escalation':'Privilege Escalation', 'C2':'C2' };
            return m[o] === phase;
        })).length;
        return { phase: phase.replace(' ', '\n'), fullPhase: phase, count, maxCount: COMBOS.length };
    });

    return (
        <section style={{ borderBottom:`1px solid ${T.border}`, background:T.s1, padding:'60px 0' }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px' }}>
                <div style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.2em', marginBottom:'8px' }}>DATA INTELLIGENCE</div>
                <h2 style={{ fontFamily:T.disp, fontSize:'2.4rem', textTransform:'uppercase', marginBottom:'40px' }}>
                    LIBRARY ANALYTICS
                </h2>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(500px, 1fr))', gap:'24px' }}>
                    {/* Bar Chart â€” Most Abused */}
                    <div style={{ background:T.bg, border:`1px solid ${T.border}`, padding:'24px' }}>
                        <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.15em', marginBottom:'20px' }}>ATTACKER INTEREST RANKING</p>
                        <ChartExplainer
                            title="Attacker Interest Ranking"
                            explanation="This chart displays the top misconfiguration combinations ranked by how attractive they are to attackers. High scores usually mean the misconfiguration is easy to exploit and provides a high payoff (e.g., direct remote code execution or admin access)."
                        >
                            <ResponsiveContainer width="100%" height={340}>
                                <BarChart data={top12.map(c => ({ name: c.name.length > 22 ? c.name.slice(0,22)+'â€¦' : c.name, score: c.interestScore }))}
                                    layout="vertical" margin={{ left:10, right:20, top:0, bottom:0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={T.s3} horizontal={false} />
                                    <XAxis type="number" domain={[0,100]} tick={{ fontFamily:T.mono, fontSize:9, fill:T.muted }} axisLine={false} tickLine={false} />
                                    <YAxis type="category" dataKey="name" width={160} tick={{ fontFamily:T.mono, fontSize:8, fill:T.muted }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
                                    <Bar dataKey="score" radius={[0,2,2,0]}>
                                        {top12.map((c, i) => (
                                            <Cell key={i} fill={INTEREST_COLOR(c.interestScore)} opacity={0.85} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartExplainer>
                    </div>

                    {/* Radar Chart â€” Kill Chain Coverage */}
                    <div style={{ background:T.bg, border:`1px solid ${T.border}`, padding:'24px' }}>
                        <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.15em', marginBottom:'20px' }}>KILL CHAIN COVERAGE</p>
                        <ChartExplainer
                            title="Kill Chain Coverage"
                            explanation="This radar graph maps the entire attack library against the standard cyber kill chain. A large spike indicates that we have many documented combinations covering that specific phase (e.g., lots of Initial Access combinations)."
                        >
                            <ResponsiveContainer width="100%" height={340}>
                                <RadarChart data={kcCoverage}>
                                    <PolarGrid stroke={T.s3} />
                                    <PolarAngleAxis dataKey="phase" tick={{ fontFamily:T.mono, fontSize:8, fill:T.muted }} />
                                    <PolarRadiusAxis angle={90} domain={[0, Math.max(...kcCoverage.map(d=>d.count))]} tick={false} axisLine={false} />
                                    <Radar name="Coverage" dataKey="count" stroke={T.red} fill={T.red} fillOpacity={0.12} strokeWidth={1.5} />
                                    <Legend formatter={() => <span style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.muted }}>LIBRARY COVERAGE</span>} />
                                    <Tooltip content={({ active, payload }) => active && payload?.length ? (
                                        <div style={{ background:'#111', border:`1px solid ${T.b2}`, padding:'8px 12px' }}>
                                            <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.white }}>{payload[0]?.payload?.fullPhase}</p>
                                            <p style={{ fontFamily:T.mono, fontSize:'0.65rem', color:T.red }}>{payload[0]?.value} combinations</p>
                                        </div>
                                    ) : null} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </ChartExplainer>
                    </div>

                    {/* Tier distribution */}
                    <div style={{ background:T.bg, border:`1px solid ${T.border}`, padding:'24px' }}>
                        <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.15em', marginBottom:'20px' }}>TIER DISTRIBUTION</p>
                        <ChartExplainer
                            title="Tier Distribution"
                            explanation="This simple chart shows the difficulty level of the attacks in the library. Beginner attacks are trivial to execute, whereas Advanced attacks require deep technical knowledge and multiple steps."
                        >
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={[
                                    { name:'BEGINNER', count:COMBOS.filter(c=>c.tier==='beginner').length, fill:T.green },
                                    { name:'INTERMEDIATE', count:COMBOS.filter(c=>c.tier==='intermediate').length, fill:T.amber },
                                    { name:'ADVANCED', count:COMBOS.filter(c=>c.tier==='advanced').length, fill:T.red },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={T.s3} vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontFamily:T.mono, fontSize:9, fill:T.muted }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontFamily:T.mono, fontSize:9, fill:T.muted }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
                                    <Bar dataKey="count" radius={[2,2,0,0]}>
                                        {['beginner','intermediate','advanced'].map((t,i) => (
                                            <Cell key={i} fill={TIER_COLOR[t]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartExplainer>

                        {/* Objective heatmap-style breakdown */}
                        <div style={{ marginTop:'20px' }}>
                            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'10px' }}>TOP ATTACK OBJECTIVES</p>
                            {['Initial Access','Lateral Movement','Credential Access','Collection','Impact','Persistence'].map(obj => {
                                const count = COMBOS.filter(c => c.objectives.includes(obj)).length;
                                const pct = count / COMBOS.length;
                                return (
                                    <div key={obj} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                                        <span style={{ fontFamily:T.mono, fontSize:'0.55rem', color:T.muted, width:'110px', flexShrink:0 }}>{obj.toUpperCase()}</span>
                                        <div style={{ flex:1, height:'6px', background:T.s3, position:'relative' }}>
                                            <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${pct*100}%`, background:T.blue, transition:'width 1s ease' }}/>
                                        </div>
                                        <span style={{ fontFamily:T.mono, fontSize:'0.55rem', color:T.blue, width:'20px', textAlign:'right' }}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* MITRE Coverage summary */}
                    <div style={{ background:T.bg, border:`1px solid ${T.border}`, padding:'24px' }}>
                        <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.15em', marginBottom:'20px' }}>MITRE TECHNIQUE COVERAGE</p>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                            {[...new Set(COMBOS.flatMap(c => c.mitreTechniques.map(t => t.id)))].sort().map(tid => {
                                const count = COMBOS.filter(c => c.mitreTechniques.some(t => t.id === tid)).length;
                                const color = count >= 3 ? T.red : count === 2 ? T.amber : T.blue;
                                return (
                                    <span key={tid} title={`${tid}: covered by ${count} combination(s)`} style={{
                                        fontFamily:T.mono, fontSize:'0.48rem', color, border:`1px solid ${color}44`,
                                        background:`${color}0d`, padding:'2px 5px', letterSpacing:'0.04em',
                                        cursor:'default',
                                    }}>
                                        {tid}
                                    </span>
                                );
                            })}
                        </div>
                        <div style={{ marginTop:'16px', display:'flex', gap:'16px' }}>
                            {[{ c:T.red, label:'3+ combinations'}, {c:T.amber, label:'2 combinations'}, {c:T.blue, label:'1 combination'}].map(({c,label}) => (
                                <div key={label} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                                    <div style={{ width:'8px', height:'8px', background:c }}/>
                                    <span style={{ fontFamily:T.mono, fontSize:'0.52rem', color:T.muted }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// LEARNING PATH TRACKER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function LearningPathTracker({ onSelect }) {
    const paths = {
        beginner: ['COMBO-001','COMBO-002','COMBO-003','COMBO-004','COMBO-005','COMBO-012','COMBO-018'],
        intermediate: ['COMBO-019','COMBO-020','COMBO-025','COMBO-026','COMBO-032','COMBO-035','COMBO-036'],
        advanced: ['COMBO-039','COMBO-040','COMBO-041','COMBO-044','COMBO-048'],
    };

    return (
        <section style={{ borderBottom:`1px solid ${T.border}`, background:'#050505', padding:'60px 0' }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px' }}>
                <div style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.2em', marginBottom:'8px' }}>STRUCTURED LEARNING</div>
                <h2 style={{ fontFamily:T.disp, fontSize:'2.4rem', textTransform:'uppercase', marginBottom:'40px' }}>RECOMMENDED PATHS</h2>
                {(['beginner','intermediate','advanced']).map(tier => {
                    const tierCombos = paths[tier].map(id => COMBOS.find(c => c.id === id)).filter(Boolean);
                    const color = TIER_COLOR[tier];
                    return (
                        <div key={tier} style={{ marginBottom:'32px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
                                <span style={{ fontFamily:T.disp, fontSize:'1.2rem', color, textTransform:'uppercase' }}>{tier}</span>
                                <div style={{ flex:1, height:'1px', background:T.s3 }}/>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:'0', overflowX:'auto', paddingBottom:'8px' }}>
                                {tierCombos.map((c, i) => (
                                    <div key={c.id} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
                                        <button onClick={() => onSelect(c)} style={{
                                            background:T.s1, border:`1px solid ${T.border}`,
                                            borderTop:`2px solid ${color}`,
                                            padding:'10px 16px', cursor:'pointer', transition:'all 0.15s',
                                            display:'flex', flexDirection:'column', gap:'4px', minWidth:'140px',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.background=T.s2; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background=T.s1; }}
                                        >
                                            <span style={{ fontFamily:T.mono, fontSize:'0.45rem', color:T.muted }}>STEP {i+1}</span>
                                            <span style={{ fontFamily:T.sans, fontSize:'0.72rem', color:T.white, lineHeight:1.3, textAlign:'left' }}>{c.name}</span>
                                        </button>
                                        {i < tierCombos.length - 1 && (
                                            <span style={{ color:color, fontSize:'1rem', padding:'0 4px', flexShrink:0 }}>â†’</span>
                                        )}
                                        {i === tierCombos.length - 1 && tier !== 'advanced' && (
                                            <span style={{ fontFamily:T.mono, fontSize:'0.5rem', color:T.muted, padding:'0 12px', flexShrink:0 }}>â†’ NEXT PATH</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FOOTER CTA
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function FooterCTA() {
    const navigate = useNavigate();
    return (
        <section style={{ padding:'72px 0', background:'radial-gradient(ellipse at 50% 100%, #1a0505 0%, #000 70%)' }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px', textAlign:'center' }}>
                <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.2em', marginBottom:'12px' }}>NEXT STEP</p>
                <h2 style={{ fontFamily:T.disp, fontSize:'clamp(2rem,5vw,4rem)', textTransform:'uppercase', marginBottom:'16px', lineHeight:1 }}>
                    READY TO SIMULATE AN ATTACK?
                </h2>
                <p style={{ fontFamily:T.sans, fontSize:'1rem', color:'#888', marginBottom:'32px', lineHeight:1.6 }}>
                    Take any combination from the library and analyze it in the ETH engine.<br/>
                    See the full kill chain, MITRE mapping, and defender recommendations â€” for your specific environment.
                </p>
                <button onClick={() => navigate('/lab')} style={{
                    fontFamily:T.mono, fontSize:'0.8rem', fontWeight:700, letterSpacing:'0.14em',
                    textTransform:'uppercase', background:T.red, color:T.white,
                    border:'none', cursor:'pointer', padding:'16px 40px', transition:'background 0.15s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background='#cc0028'}
                    onMouseLeave={e => e.currentTarget.style.background=T.red}
                >
                    OPEN ETH LAB â†’
                </button>
            </div>
        </section>
    );
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ROOT PAGE COMPONENT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
export default function AttackLibrary() {
    const gridRef    = useRef(null);
    const [search, setSearch]                   = useState('');
    const [activeTier, setActiveTier]           = useState('all');
    const [activeObjective, setActiveObjective] = useState('');
    const [selectedCombo, setSelectedCombo]     = useState(null);

    const filteredCombos = useMemo(() => {
        const q = search.toLowerCase();
        return COMBOS.filter(c => {
            if (activeTier !== 'all' && c.tier !== activeTier) return false;
            if (activeObjective && !c.objectives.includes(activeObjective)) return false;
            if (q && ![c.name, c.service, c.misconfig, ...(c.tags||[]), ...c.mitreTechniques.map(t=>t.id+' '+t.name)].join(' ').toLowerCase().includes(q)) return false;
            return true;
        });
    }, [search, activeTier, activeObjective]);

    const handleFilter = useCallback((tier) => {
        setActiveTier(tier);
        setSelectedCombo(null);
        setTimeout(() => gridRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
    }, []);

    const handleSelect = useCallback((combo) => {
        setSelectedCombo(prev => prev?.id === combo.id ? null : combo);
        setTimeout(() => gridRef.current?.scrollIntoView({ behavior:'smooth', block:'nearest' }), 50);
    }, []);

    const handleScrollToGrid = useCallback(() => {
        gridRef.current?.scrollIntoView({ behavior:'smooth', block:'start' });
    }, []);

    const schemaOrg = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Attack Combination Library",
        "description": "Educational flagship page teaching how attackers combine ports, services, and misconfigurations into attack paths.",
        "author": {
            "@type": "Organization",
            "name": "CyberEDT",
            "url": "https://www.cyberedt.com/"
        }
    };

    return (
        <main style={{ minHeight:'100vh', background:T.bg, color:T.white }}>
            <SEO 
                title="How Hackers Think: 48 Attack Scenarios | ETH"
                description="Understand the attacker mindset through 48 curated multi-vector scenarios combining ports, services, misconfigurations, and proof-of-concept steps."
                keywords="how hackers think, think like a hacker, attacker mindset for defenders, attack combinations, port security"
                canonicalUrl="/library"
                schema={schemaOrg}
            />

            <LibraryHero onScrollToGrid={handleScrollToGrid} />
            <LearningPathNavigator onFilter={handleFilter} />

            <SearchFilterBar
                search={search} setSearch={setSearch}
                activeTier={activeTier} setActiveTier={setActiveTier}
                activeObjective={activeObjective} setActiveObjective={setActiveObjective}
                resultCount={filteredCombos.length}
            />

            {/* Main grid + simulator layout */}
            <section ref={gridRef} style={{ padding:'40px 0 60px' }}>
                <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px' }}>
                    <div style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.2em', marginBottom:'8px', textTransform:'uppercase' }}>COMBINATION EXPLORER</div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'24px' }}>
                        <h2 style={{ fontFamily:T.disp, fontSize:'2rem', textTransform:'uppercase', margin:0 }}>
                            {activeTier === 'all' ? 'ALL COMBINATIONS' : TIER_LABEL[activeTier] + ' COMBINATIONS'}
                        </h2>
                        {selectedCombo && (
                            <span style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.red, letterSpacing:'0.1em' }}>
                                VIEWING: {selectedCombo.name}
                            </span>
                        )}
                    </div>

                    {filteredCombos.length === 0 ? (
                        <div style={{ textAlign:'center', padding:'60px', color:T.muted, fontFamily:T.mono, fontSize:'0.8rem' }}>
                            No combinations match your filters.
                        </div>
                    ) : (
                        <div style={{ display:'grid', gap:'24px', gridTemplateColumns: selectedCombo ? '1fr 1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', alignItems:'start' }}>
                            {/* Card grid */}
                            <div style={{ display:'grid', gap:'8px', gridTemplateColumns: selectedCombo ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', alignContent:'start' }}>
                                {filteredCombos.map(c => (
                                    <ComboCard key={c.id} combo={c} onSelect={handleSelect} isSelected={selectedCombo?.id === c.id} />
                                ))}
                            </div>

                            {/* Simulator panel */}
                            {selectedCombo && (
                                <ScenarioPanel combo={selectedCombo} onClose={() => setSelectedCombo(null)} />
                            )}
                        </div>
                    )}
                </div>
            </section>

            <VisualizationsSection />
            <LearningPathTracker onSelect={handleSelect} />
            <FooterCTA />
        </main>
    );
}
