import { useState, useMemo } from 'react';
import SEO from '@/components/SEO';
import { vulnerabilitiesData } from '@/data/vulnerabilitiesData';
import { ShieldAlert, AlertTriangle, Bug } from 'lucide-react';

export default function Vulnerabilities() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVulns = useMemo(() => {
        if (!searchTerm) return vulnerabilitiesData;
        const lower = searchTerm.toLowerCase();
        return vulnerabilitiesData.filter(v => 
            v.cve_id?.toLowerCase().includes(lower) ||
            v.vulnerability_name?.toLowerCase().includes(lower) ||
            v.vendor?.toLowerCase().includes(lower) ||
            v.product?.toLowerCase().includes(lower)
        );
    }, [searchTerm]);

    const W = { maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' };

    const getSeverityColor = (severity) => {
        switch(severity?.toLowerCase()) {
            case 'critical': return 'var(--color-danger)';
            case 'high': return 'var(--color-warning)';
            case 'medium': return 'var(--color-info)';
            default: return '#888';
        }
    };

    return (
        <main style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)', paddingBottom: '100px' }}>
            <SEO 
                title="Vulnerability Intelligence" 
                description="Database of critical CVEs and their mapping to MITRE ATT&CK techniques."
                canonicalUrl="/vulnerabilities"
            />
            
            <section style={{ borderBottom: '1px solid var(--color-border)', paddingTop: '40px', background: 'radial-gradient(circle at 50% 0%, #1a0505 0%, #000 70%)' }}>
                <header style={{ ...W }}>
                    <div className="terminal-label" style={{ marginBottom: '24px', color: 'var(--color-accent)' }}>CYBEREDT INTELLIGENCE</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '24px' }}>
                        Vulnerability Library
                    </h1>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#aaa', lineHeight: 1.6, maxWidth: '800px', marginBottom: '32px' }}>
                        Explore known exploited vulnerabilities (KEV) and understand how they fit into the attacker kill chain.
                    </p>
                    <input 
                        type="text" 
                        placeholder="Search by CVE ID, vendor, or product..." 
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
                    {filteredVulns.map((vuln) => (
                        <article key={vuln.cve_id} style={{ border: '1px solid #333', background: '#0a0a0a', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', margin: '0', color: '#fff' }}>
                                    {vuln.cve_id}
                                </h3>
                                <div style={{ 
                                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 'bold',
                                    color: getSeverityColor(vuln.severity), border: `1px solid ${getSeverityColor(vuln.severity)}`, 
                                    padding: '2px 8px', borderRadius: '4px' 
                                }}>
                                    {vuln.severity?.toUpperCase()} ({vuln.cvss_v3_score})
                                </div>
                            </div>
                            
                            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#ddd', margin: '0 0 12px 0' }}>
                                {vuln.vulnerability_name}
                            </h4>
                            
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#aaa', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
                                {vuln.summary}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #222', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#888' }}>
                                    <Bug size={16} /> <strong>Vendor/Product:</strong> {vuln.vendor} {vuln.product}
                                </div>
                                {vuln.mitre_attack && vuln.mitre_attack.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#888' }}>
                                        <AlertTriangle size={16} /> <strong>Technique:</strong> {vuln.mitre_attack[0].technique_id} - {vuln.mitre_attack[0].technique_name}
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                    
                    {filteredVulns.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#666', fontFamily: 'var(--font-mono)' }}>
                            No vulnerabilities found matching your search.
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
