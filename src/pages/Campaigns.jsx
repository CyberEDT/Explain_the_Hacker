import { useState, useMemo } from 'react';
import SEO from '@/components/SEO';
import { campaignsData } from '@/data/campaignsData';
import { ShieldAlert, Calendar, MapPin, Target } from 'lucide-react';

export default function Campaigns() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCampaigns = useMemo(() => {
        if (!searchTerm) return campaignsData;
        const lower = searchTerm.toLowerCase();
        return campaignsData.filter(c => 
            c.campaign_name?.toLowerCase().includes(lower) ||
            c.attributed_actor?.toLowerCase().includes(lower) ||
            c.target_industries?.some(ind => ind.toLowerCase().includes(lower))
        );
    }, [searchTerm]);

    const W = { maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' };

    return (
        <main style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)', paddingBottom: '100px' }}>
            <SEO 
                title="Historical Campaigns" 
                description="Explore historical threat actor campaigns, their targets, and the techniques used in major cyber attacks."
                canonicalUrl="/campaigns"
            />
            
            <section style={{ borderBottom: '1px solid var(--color-border)', paddingTop: '40px', background: 'radial-gradient(circle at 50% 0%, #1a0505 0%, #000 70%)' }}>
                <header style={{ ...W }}>
                    <div className="terminal-label" style={{ marginBottom: '24px', color: 'var(--color-accent)' }}>CYBEREDT INTELLIGENCE</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '24px' }}>
                        Historical Campaigns
                    </h1>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#aaa', lineHeight: 1.6, maxWidth: '800px', marginBottom: '32px' }}>
                        Contextualize modern threats by reviewing significant historical cyber campaigns, attributed threat actors, and their TTPs.
                    </p>
                    <input 
                        type="text" 
                        placeholder="Search campaigns, actors, or industries..." 
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
                    {filteredCampaigns.map((campaign) => (
                        <article key={campaign.campaign_id} style={{ border: '1px solid #333', background: '#0a0a0a', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: '0 0 8px 0', color: '#fff' }}>
                                        {campaign.campaign_name}
                                    </h3>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-warning)', border: '1px solid var(--color-warning)', display: 'inline-block', padding: '2px 8px', borderRadius: '4px' }}>
                                        {campaign.campaign_type}
                                    </div>
                                </div>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 'bold', color: '#444' }}>
                                    {campaign.year}
                                </span>
                            </div>
                            
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#ccc', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
                                {campaign.description}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #222', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#888' }}>
                                    <ShieldAlert size={16} /> <strong>Actor:</strong> {campaign.attributed_actor}
                                </div>
                                {campaign.target_industries && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#888' }}>
                                        <Target size={16} /> <strong>Targets:</strong> {campaign.target_industries.join(', ')}
                                    </div>
                                )}
                                {campaign.origin_country && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#888' }}>
                                        <MapPin size={16} /> <strong>Origin:</strong> {campaign.origin_country}
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                    
                    {filteredCampaigns.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#666', fontFamily: 'var(--font-mono)' }}>
                            No campaigns found matching your search.
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
