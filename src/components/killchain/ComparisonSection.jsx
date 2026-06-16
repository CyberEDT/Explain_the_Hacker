import React from 'react';

export default function ComparisonSection() {
    return (
        <section style={{ padding: '80px 32px', background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div className="terminal-label" style={{ marginBottom: '16px', color: '#ffaa00' }}>FRAMEWORK COMPARISON</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#fff', textTransform: 'uppercase' }}>
                        Kill Chain vs MITRE ATT&CK
                    </h2>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#888', maxWidth: '600px', margin: '16px auto 0' }}>
                        Two models, one goal. Understand how the Cyber Kill Chain and MITRE ATT&CK complement each other in threat analysis.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cyber Kill Chain Card */}
                    <div style={{ background: '#050505', border: '1px solid #222', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#ff0033' }} />
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#fff', marginBottom: '16px' }}>
                            CYBER KILL CHAIN
                        </h3>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#ff0033', marginBottom: '24px' }}>STRATEGIC / SEQUENTIAL</div>
                        
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { title: 'Focus', desc: 'High-level stages of an attack.' },
                                { title: 'Structure', desc: 'Strict sequence. An attacker must complete one stage to progress to the next.' },
                                { title: 'Strength', desc: 'Excellent for executive reporting and high-level defensive strategy.' },
                                { title: 'Limitation', desc: 'Lacks granular detail on specific techniques and procedures.' }
                            ].map((item, i) => (
                                <li key={i}>
                                    <strong style={{ display: 'block', color: '#ccc', fontFamily: 'var(--font-sans)', fontSize: '1rem', marginBottom: '4px' }}>{item.title}</strong>
                                    <span style={{ color: '#888', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* MITRE ATT&CK Card */}
                    <div style={{ background: '#050505', border: '1px solid #222', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#00aaff' }} />
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#fff', marginBottom: '16px' }}>
                            MITRE ATT&CK
                        </h3>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#00aaff', marginBottom: '24px' }}>TACTICAL / MATRIX-BASED</div>
                        
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { title: 'Focus', desc: 'Detailed catalog of attacker behaviors (TTPs).' },
                                { title: 'Structure', desc: 'Matrix format. Attackers can jump between tactics non-sequentially.' },
                                { title: 'Strength', desc: 'Unparalleled depth for detection engineering, hunting, and emulation.' },
                                { title: 'Limitation', desc: 'Can be overwhelming and difficult to use for simple chronological narrative.' }
                            ].map((item, i) => (
                                <li key={i}>
                                    <strong style={{ display: 'block', color: '#ccc', fontFamily: 'var(--font-sans)', fontSize: '1rem', marginBottom: '4px' }}>{item.title}</strong>
                                    <span style={{ color: '#888', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Integration Graphic */}
                <div style={{ marginTop: '64px', textAlign: 'center', background: '#111', padding: '40px', borderRadius: '4px', border: '1px dashed #333' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#fff', marginBottom: '16px' }}>ETH INTEGRATION WORKFLOW</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '16px', color: '#888', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        <span style={{ padding: '8px 16px', border: '1px solid #333', background: '#000' }}>USER INPUT</span>
                        <span>→</span>
                        <span style={{ padding: '8px 16px', border: '1px solid #333', background: '#000' }}>ETH ANALYSIS</span>
                        <span>→</span>
                        <span style={{ padding: '8px 16px', border: '1px solid #ff0033', background: 'rgba(255,0,51,0.1)', color: '#ff0033' }}>KILL CHAIN MAPPING</span>
                        <span>→</span>
                        <span style={{ padding: '8px 16px', border: '1px solid #00aaff', background: 'rgba(0,170,255,0.1)', color: '#00aaff' }}>MITRE MAPPING</span>
                        <span>→</span>
                        <span style={{ padding: '8px 16px', border: '1px solid #ffaa00', background: 'rgba(255,170,0,0.1)', color: '#ffaa00' }}>ATTACKER NARRATIVE</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
