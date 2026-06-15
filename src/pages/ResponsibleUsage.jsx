import React from 'react';

const PageLayout = ({ title, subtitle, children }) => (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)', paddingBottom: '100px' }}>
        <section style={{ borderBottom: '1px solid var(--color-border)', paddingTop: '40px', background: '#050505' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 32px' }}>
                <div className="terminal-label" style={{ marginBottom: '24px', color: 'var(--color-accent)' }}>{subtitle}</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '24px' }}>
                    {title}
                </h1>
            </div>
        </section>
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#bbb', lineHeight: 1.7 }}>
                {children}
            </div>
        </section>
    </div>
);

const Section = ({ title, children }) => (
    <div>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid #222', paddingBottom: '8px' }}>
            {title}
        </h2>
        {children}
    </div>
);

export default function ResponsibleUsage() {
    return (
        <PageLayout title="Responsible Usage" subtitle="CYBEREDT ETHICS">
            <Section title="1. Educational & Defensive Purpose">
                <p>The CyberEDT platform and the ETH engine are strictly designed for:</p>
                <ul style={{ listStyleType: 'square', paddingLeft: '24px', marginTop: '12px', color: '#aaa' }}>
                    <li><strong>Defensive Cybersecurity:</strong> Hardening networks by identifying exposed vulnerabilities.</li>
                    <li><strong>Education:</strong> Helping students and junior analysts understand how attackers think and maneuver.</li>
                    <li><strong>Exposure Intelligence:</strong> Providing transparent attack-path threat modeling.</li>
                    <li><strong>SOC Learning:</strong> Assisting Security Operations Centers in writing better detection logic.</li>
                </ul>
            </Section>

            <Section title="2. Zero Tolerance for Offensive Abuse">
                <p>We maintain a zero-tolerance policy for offensive abuse. CyberEDT is NOT designed for, and must not be used for:</p>
                <ul style={{ listStyleType: 'square', paddingLeft: '24px', marginTop: '12px', color: '#aaa' }}>
                    <li>Offensive cyber operations or unauthorized hacking.</li>
                    <li>Malicious automation or exploit generation.</li>
                    <li>Real-world attacks against unauthorized targets.</li>
                </ul>
                <p style={{ marginTop: '16px' }}>The tools provided are assistive intelligence systems meant to identify risk, not weaponize it.</p>
            </Section>

            <Section title="3. Critical Review of AI Outputs">
                <p>As an AI-assisted threat analysis platform, ETH generates intelligent correlations based on the data it receives. However, it is fundamentally an <strong>assistive intelligence system</strong>.</p>
                <ul style={{ listStyleType: 'square', paddingLeft: '24px', marginTop: '12px', color: '#aaa' }}>
                    <li>All AI-generated outputs should be reviewed critically by human analysts.</li>
                    <li>Predictive models and attack chains may evolve over time as our engine matures.</li>
                    <li>Never treat the engine's output as absolute truth without verifying the underlying telemetry and logs.</li>
                </ul>
            </Section>
        </PageLayout>
    );
}
