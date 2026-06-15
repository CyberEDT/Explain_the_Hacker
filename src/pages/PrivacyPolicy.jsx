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

export default function PrivacyPolicy() {
    return (
        <PageLayout title="Privacy Policy" subtitle="CYBEREDT GOVERNANCE">
            <Section title="1. Data Collection">
                <p>When you use the ETH (Explain The Hacker) engine, you may submit data for analysis. This can include:</p>
                <ul style={{ listStyleType: 'square', paddingLeft: '24px', marginTop: '12px', color: '#aaa' }}>
                    <li>Raw log snippets, IP addresses, and URLs</li>
                    <li>Attack indicators and file hashes</li>
                    <li>Details of exposed ports and system configurations</li>
                    <li>Browser metadata and session identifiers</li>
                </ul>
                <p style={{ marginTop: '16px' }}>This data is collected solely to power the real-time analytical engine, map findings to the MITRE ATT&CK framework, and generate accurate threat correlations.</p>
            </Section>

            <Section title="2. User Privacy Protection">
                <p>CyberEDT operates under a strict privacy-first philosophy:</p>
                <ul style={{ listStyleType: 'square', paddingLeft: '24px', marginTop: '12px', color: '#aaa' }}>
                    <li><strong>No Sale of Data:</strong> We do NOT sell your uploaded telemetry, indicators, or analysis results to third-party data brokers.</li>
                    <li><strong>No Malicious Reuse:</strong> Uploaded attack surface data is not used to target, scan, or attack your infrastructure.</li>
                    <li><strong>Temporary Processing:</strong> The ETH engine processes your data ephemerally to generate the attack-chain simulation. We do not permanently retain your raw logs.</li>
                </ul>
                <div style={{ background: 'rgba(232,24,58,0.05)', borderLeft: '3px solid var(--color-danger)', padding: '16px', marginTop: '24px' }}>
                    <strong style={{ color: 'var(--color-danger)', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>CRITICAL WARNING</strong>
                    Users should NEVER upload classified government documents, highly sensitive PII, or proprietary source code. Always sanitize logs before submission.
                </div>
            </Section>

            <Section title="3. AI & Analysis Disclaimer">
                <p>The ETH engine utilizes advanced threat correlation modeling to generate cybersecurity insights. It is important to understand that:</p>
                <ul style={{ listStyleType: 'square', paddingLeft: '24px', marginTop: '12px', color: '#aaa' }}>
                    <li>Outputs may contain <strong>INFERRED</strong> or <strong>POTENTIAL</strong> findings based on predictive logic, not just verified facts.</li>
                    <li>The accuracy of the simulation is entirely dependent on the quality and completeness of the input data you provide.</li>
                    <li>False positives can occur. The AI-assisted analysis should be validated by human security analysts before taking critical containment actions.</li>
                </ul>
            </Section>

            <Section title="4. Security Commitment">
                <p>We take the security of our platform seriously. CyberEDT employs modern application hardening, encrypted transport (TLS), and secure processing environments. While we strive to protect all user submissions, users remain responsible for ensuring they have authorization to upload and analyze the data they provide.</p>
            </Section>
        </PageLayout>
    );
}
