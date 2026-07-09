import React from 'react';
import SEO from '@/components/SEO';

export default function Docs() {
    const W = { maxWidth: '1000px', margin: '0 auto', padding: '64px 32px' };

    const schemaOrg = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Explain The Hacker - Platform Documentation",
        "description": "Comprehensive guide on utilizing the threat simulation engine to analyze network vulnerabilities, parse misconfigurations, and visualize MITRE ATT&CK kill chains.",
        "author": {
            "@type": "Organization",
            "name": "CyberEDT",
            "url": "https://www.cyberedt.com/"
        }
    };

    return (
        <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: '100px' }}>
            <SEO 
                title="Platform Documentation"
                description="Comprehensive guide on utilizing the ETH threat simulation engine by CyberEDT."
                canonicalUrl="/docs"
                schema={schemaOrg}
            />

            {/* Header Section */}
            <section aria-labelledby="docs-title" style={{ borderBottom: '1px solid #111', paddingTop: '40px' }}>
                <header style={{ ...W }}>
                    <div aria-hidden="true" className="terminal-label" style={{ marginBottom: '24px' }}>PLATFORM DOCUMENTATION</div>
                    <h1 id="docs-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '24px' }}>
                        Explain The Hacker <span style={{ color: '#e8183a' }}>// DOCS</span>
                    </h1>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#666', lineHeight: 1.6, maxWidth: '600px', marginBottom: '24px' }}>
                        Comprehensive guide on utilizing the threat simulation engine to analyze network vulnerabilities, parse misconfigurations, and visualize MITRE ATT&CK kill chains.
                    </p>
                </header>
            </section>

            {/* Section 1: Running a Simulation */}
            <section style={{ borderBottom: '1px solid #111' }}>
                <div style={{ ...W }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase', marginBottom: '32px' }}>
                        1. Running a Simulation
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
                        <div style={{ borderLeft: '2px solid #00aaff', paddingLeft: '20px' }}>
                            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>Input Parameters</h3>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#888', lineHeight: 1.7 }}>
                                The simulation engine accepts a combination of exposed ports, known misconfigurations, and raw log snippets. It correlates these inputs in real-time to determine the most probable initial access vectors and subsequent lateral movement paths that an Advanced Persistent Threat (APT) might take.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Attack Chain */}
            <section style={{ borderBottom: '1px solid #111' }}>
                <div style={{ ...W }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase', marginBottom: '32px' }}>
                        2. Understanding the Attack Chain
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
                        <div style={{ borderLeft: '2px solid #ffaa00', paddingLeft: '20px' }}>
                            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>The 7-Phase Cyber Kill Chain</h3>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#888', lineHeight: 1.7 }}>
                                Results are mapped strictly against the classic 7-phase model (Reconnaissance, Weaponization, Delivery, Exploitation, Installation, Command & Control, Actions on Objectives). Each phase breaks down into specific MITRE ATT&CK techniques (e.g., T1595 - Active Scanning) to provide highly actionable threat hunting intelligence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Section 3: Risk & IOCs */}
            <section style={{ borderBottom: '1px solid #111' }}>
                <div style={{ ...W }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase', marginBottom: '32px' }}>
                        3. Risk Scoring & IOCs
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
                        <div style={{ borderLeft: '2px solid #e8183a', paddingLeft: '20px' }}>
                            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>Threat Quantification</h3>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#888', lineHeight: 1.7, marginBottom: '16px' }}>
                                The engine calculates a dynamic risk score (0-99) based on the severity of exposed services and the ease of exploitation. A higher score indicates a higher likelihood of automated breach.
                            </p>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#888', lineHeight: 1.7 }}>
                                It also generates simulated Indicators of Compromise (IOCs)—such as malicious IP addresses, C2 payload hashes, and staging URLs—which can be directly ingested into EDR/SIEM tools to write preemptive detection rules.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
