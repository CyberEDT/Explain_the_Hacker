import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, Legend } from 'recharts';
import { BrainCircuit, Cpu, Target, Network, Layers, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import ChartExplainer from '../components/ChartExplainer';

// ─── DATA FOR CHARTS ────────────────────────────────────────────────────────
const evolutionData = [
    { phase: 'MVP', accuracy: 40, explainability: 30, ai: 0 },
    { phase: 'V2', accuracy: 75, explainability: 60, ai: 0 },
    { phase: 'V3', accuracy: 90, explainability: 85, ai: 10 },
    { phase: 'AI Beta', accuracy: 92, explainability: 95, ai: 60 },
    { phase: 'Enterprise', accuracy: 98, explainability: 98, ai: 95 },
];

const sophisticationData = [
    { time: 'Q1 2026', reactive: 80, predictive: 20 },
    { time: 'Q3 2026', reactive: 70, predictive: 45 },
    { time: 'Q1 2027', reactive: 50, predictive: 75 },
    { time: 'Q4 2027', reactive: 20, predictive: 95 },
];

// Custom Tooltip for Dark Theme
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '12px', fontFamily: 'var(--font-mono)' }}>
                <p style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '0.85rem' }}>{label}</p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`} style={{ color: entry.color, margin: '4px 0', fontSize: '0.75rem' }}>
                        {entry.name}: {entry.value}%
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────
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

function PhaseCard({ phaseNum, title, date, focusList, status, progressColor, progressValue }) {
    const isCompleted = status === 'Completed' || status === 'Active';
    const isInProgress = status === 'In Progress';
    
    return (
        <div style={{ 
            border: `1px solid ${isInProgress ? 'var(--color-accent)' : '#222'}`, 
            background: isInProgress ? 'rgba(232, 24, 58, 0.03)' : '#050505', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PHASE {phaseNum} — {date}</span>
                    <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: isInProgress ? 'var(--color-accent)' : '#fff', fontWeight: 700, margin: '8px 0 0' }}>
                        {title}
                    </h3>
                </div>
                <div style={{ 
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, 
                    padding: '4px 8px', 
                    background: isCompleted ? 'rgba(0, 255, 157, 0.1)' : isInProgress ? 'rgba(232, 24, 58, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    color: isCompleted ? 'var(--color-success)' : isInProgress ? 'var(--color-accent)' : '#888',
                    border: `1px solid ${isCompleted ? 'var(--color-success)' : isInProgress ? 'var(--color-accent)' : '#444'}`
                }}>
                    {status}
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Core Focus</span>
                <ul style={{ margin: 0, paddingLeft: '20px', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#ccc', lineHeight: 1.6 }}>
                    {focusList.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>

            {/* Progress Bar Alternative (Cleaner than Radial for cards) */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #111' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#666' }}>COMPLETION</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: progressColor }}>{progressValue}%</span>
                </div>
                <div style={{ height: '4px', background: '#111', width: '100%' }}>
                    <div style={{ height: '100%', width: `${progressValue}%`, background: progressColor, transition: 'width 1s ease-in-out' }}></div>
                </div>
            </div>
        </div>
    );
}

export default function Roadmap() {
    const W = { maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)', paddingBottom: '100px' }}>
            
            {/* Header / Hero */}
            <section style={{ borderBottom: '1px solid var(--color-border)', paddingTop: '40px', background: 'radial-gradient(circle at 50% 0%, #0a1128 0%, #000 70%)' }}>
                <div style={{ ...W }}>
                    <div className="terminal-label" style={{ marginBottom: '24px', color: 'var(--color-info)' }}>ENTERPRISE MATURITY TRACKER</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '24px' }}>
                        Platform Evolution <span style={{ color: 'var(--color-text-muted)' }}>// ROADMAP</span>
                    </h1>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#aaa', lineHeight: 1.6, maxWidth: '800px', marginBottom: '32px' }}>
                        A transparent look at the development journey of the ETH platform—from its MVP stabilization phase through its evolution into a predictive, AI-assisted enterprise threat intelligence engine.
                    </p>
                </div>
            </section>

            {/* 1. OVERALL METRICS (AreaChart) */}
            <section style={{ borderBottom: '1px solid var(--color-border)', background: '#050505' }}>
                <div style={{ ...W }}>
                    <SectionHeading 
                        title="Intelligence Maturity" 
                        subtitle="Platform evolution across accuracy, explainability, and AI integration over time." 
                    />
                    
                    <div style={{ width: '100%', background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '24px', paddingTop: '10px' }}>
                        <ChartExplainer
                            title="Intelligence Maturity over Time"
                            explanation="This chart visualizes the platform's evolution. As we progress through the roadmap, you can see Engine Accuracy and AI Integration climbing, significantly boosting the overall Explainability Score of the threat intelligence."
                        >
                            <ResponsiveContainer width="100%" height={360}>
                                <AreaChart data={evolutionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-info)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--color-info)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                                    <XAxis dataKey="phase" stroke="#444" tick={{fill: '#888', fontSize: 12, fontFamily: 'monospace'}} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#444" tick={{fill: '#888', fontSize: 12, fontFamily: 'monospace'}} tickLine={false} axisLine={false} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="accuracy" name="Engine Accuracy" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorAcc)" />
                                    <Area type="monotone" dataKey="explainability" name="Explainability Score" stroke="var(--color-warning)" fillOpacity={1} fill="url(#colorExp)" />
                                    <Area type="monotone" dataKey="ai" name="AI Integration Level" stroke="var(--color-info)" fillOpacity={1} fill="url(#colorAI)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartExplainer>
                    </div>
                </div>
            </section>

            {/* 2. ROADMAP PHASES */}
            <section style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ ...W }}>
                    <SectionHeading 
                        title="Development Phases" 
                        subtitle="Detailed roadmap execution timeline and core focus areas." 
                    />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        <PhaseCard 
                            phaseNum="1"
                            title="MVP Stabilization"
                            date="Early 2026"
                            status="Completed"
                            progressColor="var(--color-success)"
                            progressValue={100}
                            focusList={[
                                'False-positive reduction in telemetry parsing',
                                'Attack-chain realism & validation logic',
                                'Strict MITRE ATT&CK mappings',
                                'Stable and dynamic risk scoring system'
                            ]}
                        />
                        <PhaseCard 
                            phaseNum="2"
                            title="Analysis & Explainability"
                            date="Mid 2026"
                            status="In Progress"
                            progressColor="var(--color-accent)"
                            progressValue={65}
                            focusList={[
                                'Dedicated Threat Intel educational hub',
                                'Clear separation of Verified vs Inferred findings',
                                'Better correlation understanding & explainers',
                                'UI/UX enhancements for attack-flow visibility'
                            ]}
                        />
                        <PhaseCard 
                            phaseNum="3"
                            title="AI & Adv. Intelligence"
                            date="Early 2027"
                            status="Planned"
                            progressColor="var(--color-info)"
                            progressValue={10}
                            focusList={[
                                'LLM-assisted contextual explanations',
                                'Dynamic threat reasoning and path generation',
                                'Intelligent, automated remediation guidance',
                                'Advanced confidence and severity scoring'
                            ]}
                        />
                        <PhaseCard 
                            phaseNum="4"
                            title="Final Enterprise Release"
                            date="Late 2027"
                            status="Future Release"
                            progressColor="#666"
                            progressValue={0}
                            focusList={[
                                'Enterprise-grade threat intelligence engine',
                                'Multi-input log and SIEM data analysis',
                                'Highly scalable intelligence architecture',
                                'Analyst-grade SOC reporting integrations'
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* 3. INTELLIGENCE SOPHISTICATION MATRIX (LineChart) */}
            <section>
                <div style={{ ...W }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
                        
                        <div>
                            <SectionHeading 
                                title="Sophistication Matrix" 
                                subtitle="Shifting from reactive to predictive threat modeling." 
                            />
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#bbb', lineHeight: 1.6, marginBottom: '24px' }}>
                                A key goal of the ETH platform is to move away from purely <strong>Reactive</strong> analysis (alerting after a breach has occurred) toward <strong>Predictive</strong> threat modeling. 
                            </p>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#bbb', lineHeight: 1.6 }}>
                                By correlating exposed attack surfaces with known MITRE techniques, ETH aims to achieve a 95% predictive analysis capability by the Enterprise release in late 2027, allowing SOC teams to preemptively close kill chains.
                            </p>
                        </div>
                        
                        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '24px', paddingTop: '10px' }}>
                            <ChartExplainer
                                title="Sophistication Matrix"
                                explanation="This line chart contrasts reactive alerts with proactive threat modeling over the lifespan of our roadmap. The blue line demonstrates our goal to predict threats before they materialize."
                            >
                                <ResponsiveContainer width="100%" height={260}>
                                    <LineChart data={sophisticationData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                                        <XAxis dataKey="time" stroke="#444" tick={{fill: '#888', fontSize: 12, fontFamily: 'monospace'}} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#444" tick={{fill: '#888', fontSize: 12, fontFamily: 'monospace'}} tickLine={false} axisLine={false} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }} />
                                        <Line type="monotone" dataKey="reactive" name="Reactive Alerts" stroke="#e8183a" strokeWidth={2} dot={{ fill: '#e8183a', r: 4 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="predictive" name="Predictive Modeling" stroke="#00aaff" strokeWidth={2} dot={{ fill: '#00aaff', r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartExplainer>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}
