import { useState, useMemo } from 'react';
import SEO from '@/components/SEO';
import { networkExposureData } from '@/data/networkExposureData';
import { Server, Activity, ShieldAlert } from 'lucide-react';

export default function NetworkExposure() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRecords = useMemo(() => {
        if (!searchTerm) return networkExposureData;
        const lower = searchTerm.toLowerCase();
        return networkExposureData.filter(r => 
            r.name?.toLowerCase().includes(lower) ||
            r.ports?.toLowerCase().includes(lower) ||
            r.category?.toLowerCase().includes(lower)
        );
    }, [searchTerm]);

    const W = { maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' };

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--color-danger)';
        if (score >= 50) return 'var(--color-warning)';
        return 'var(--color-success)';
    };

    return (
        <main style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)', paddingBottom: '100px' }}>
            <SEO 
                title="Network Exposure Intelligence" 
                description="Analysis of internet-exposed services, common misconfigurations, and attacker interest."
                canonicalUrl="/network-exposure"
            />
            
            <section style={{ borderBottom: '1px solid var(--color-border)', paddingTop: '40px', background: 'radial-gradient(circle at 50% 0%, #1a0505 0%, #000 70%)' }}>
                <header style={{ ...W }}>
                    <div className="terminal-label" style={{ marginBottom: '24px', color: 'var(--color-accent)' }}>CYBEREDT INTELLIGENCE</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '24px' }}>
                        Network Exposure
                    </h1>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#aaa', lineHeight: 1.6, maxWidth: '800px', marginBottom: '32px' }}>
                        Understand the risk of internet-exposed services, how attackers enumerate them, and actionable mitigations.
                    </p>
                    <input 
                        type="text" 
                        placeholder="Search services, ports, or categories..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', maxWidth: '600px', padding: '12px 16px',
                            background: '#111', border: '1px solid #333', color: '#fff',
                            fontFamily: 'var(--font-mono)', fontSize: '0.9rem'
                        }}
                    />
                </header>
            </section>

            <section style={{ ...W }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {filteredRecords.map((record) => (
                        <article key={record.id} style={{ border: '1px solid #333', background: '#0a0a0a', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: '0 0 8px 0', color: '#fff' }}>
                                        {record.name}
                                    </h3>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#888', border: '1px solid #444', display: 'inline-block', padding: '2px 8px', borderRadius: '4px' }}>
                                        {record.category}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 'bold', color: '#bbb', display: 'block' }}>
                                        Port: {record.ports}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: getScoreColor(record.risk_score), fontWeight: 'bold' }}>
                                        Risk: {record.risk_score}/100
                                    </span>
                                </div>
                            </div>
                            
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#ccc', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
                                {record.description}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #222', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#888' }}>
                                    <Activity size={16} style={{ marginTop: '2px', flexShrink: 0 }} /> 
                                    <span><strong>Attacker Interest:</strong> {record.attacker_interest}</span>
                                </div>
                                {record.common_products && record.common_products.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#888' }}>
                                        <Server size={16} style={{ marginTop: '2px', flexShrink: 0 }} /> 
                                        <span><strong>Common Implementations:</strong> {record.common_products.join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                    
                    {filteredRecords.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#666', fontFamily: 'var(--font-mono)' }}>
                            No exposures found matching your search.
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
