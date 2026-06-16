import React from 'react';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    LineChart, Line
} from 'recharts';

const COVERAGE_DATA = [
    { subject: 'Recon', coverage: 30, industry: 50 },
    { subject: 'Weaponize', coverage: 20, industry: 30 },
    { subject: 'Deliver', coverage: 85, industry: 70 },
    { subject: 'Exploit', coverage: 65, industry: 60 },
    { subject: 'Install', coverage: 90, industry: 80 },
    { subject: 'C2', coverage: 75, industry: 70 },
    { subject: 'Impact', coverage: 50, industry: 40 },
];

const POPULARITY_DATA = [
    { stage: 'Recon', value: 45 },
    { stage: 'Weaponize', value: 30 },
    { stage: 'Deliver', value: 90 },
    { stage: 'Exploit', value: 75 },
    { stage: 'Install', value: 85 },
    { stage: 'C2', value: 60 },
    { stage: 'Impact', value: 50 },
];

const PROGRESSION_DATA = [
    { time: '0h', Recon: 10, Deliver: 0, Install: 0, Impact: 0 },
    { time: '2h', Recon: 30, Deliver: 5, Install: 0, Impact: 0 },
    { time: '4h', Recon: 5, Deliver: 80, Install: 10, Impact: 0 },
    { time: '6h', Recon: 0, Deliver: 10, Install: 70, Impact: 5 },
    { time: '8h', Recon: 0, Deliver: 0, Install: 20, Impact: 90 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#111', border: '1px solid #333', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <p style={{ color: '#fff', marginBottom: '8px' }}>{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function VisualAnalytics() {
    return (
        <section style={{ padding: '80px 32px', background: '#050505', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '48px' }}>
                    <div className="terminal-label" style={{ marginBottom: '16px', color: '#ffaa00' }}>THREAT TELEMETRY</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#fff', textTransform: 'uppercase' }}>
                        Visual Analytics
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Radar Chart */}
                    <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '24px', height: '400px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', marginBottom: '16px', textAlign: 'center' }}>
                            Detection Coverage
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={COVERAGE_DATA}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Your Org" dataKey="coverage" stroke="#00aaff" fill="#00aaff" fillOpacity={0.3} />
                                <Radar name="Industry Avg" dataKey="industry" stroke="#ffaa00" fill="#ffaa00" fillOpacity={0.1} />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '24px', height: '400px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', marginBottom: '16px', textAlign: 'center' }}>
                            Stage Popularity in Recent Incidents
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={POPULARITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="stage" tick={{ fill: '#888', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#888', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#111' }} />
                                <Bar dataKey="value" fill="#ff0033" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Timeline/Line Chart */}
                    <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '24px', height: '400px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', marginBottom: '16px', textAlign: 'center' }}>
                            Attack Velocity Pattern
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={PROGRESSION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="time" tick={{ fill: '#888', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#888', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="Recon" stroke="#00aaff" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Deliver" stroke="#ffaa00" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Install" stroke="#ff0033" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Impact" stroke="#fff" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </section>
    );
}
