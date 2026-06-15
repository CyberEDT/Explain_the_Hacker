import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';
import { MITRE_TACTICS, ATTACK_TIMELINE } from '../../data/tacticsData';
import { Activity } from 'lucide-react';

export default function TacticsVisualizations() {
    const barData = MITRE_TACTICS.map(t => ({
        name: t.name,
        popularity: t.popularity
    })).sort((a, b) => b.popularity - a.popularity).slice(0, 7);

    const radarData = MITRE_TACTICS.map(t => ({
        subject: t.name,
        A: t.techniquesSpread,
        fullMark: 20,
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '12px' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fff', marginBottom: '4px' }}>
                        {payload[0].payload.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#ff0033' }}>
                        FREQ: {payload[0].value}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <section style={{ padding: '80px 32px', background: '#0a0a0a', borderBottom: '1px solid #111' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '48px' }}>
                    <div className="terminal-label" style={{ marginBottom: '16px' }}>THREAT INTELLIGENCE</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', color: '#fff', textTransform: 'uppercase' }}>
                        Visual Analytics
                    </h2>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#888', maxWidth: '600px', marginTop: '16px' }}>
                        Data-driven insights into attacker behavior across global incident response engagements.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Bar Chart */}
                    <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '32px' }}>
                        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={16} color="#ff0033" /> MOST ABUSED TACTICS (LAST 30 DAYS)
                        </h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" stroke="#444" fontSize={10} tickFormatter={(val) => val.substring(0, 4) + '.'} />
                                    <YAxis stroke="#444" fontSize={10} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                    <Bar dataKey="popularity" radius={[2, 2, 0, 0]}>
                                        {barData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index < 3 ? '#ff0033' : '#ffaa00'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Radar Chart */}
                    <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '32px' }}>
                        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={16} color="#00aaff" /> TECHNIQUE DISTRIBUTION (APT-41)
                        </h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="#333" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 9, fontFamily: 'monospace' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
                                    <Radar name="Techniques" dataKey="A" stroke="#00aaff" fill="#00aaff" fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
