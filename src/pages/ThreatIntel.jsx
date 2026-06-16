import React from 'react';
import { Link } from 'react-router-dom';

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

function PipelineStep({ step, title, desc, arrow }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{ flex: 1, border: '1px solid #333', background: '#000', padding: '20px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: -10, left: 16, background: '#000', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 700 }}>STEP {step}</span>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '0 0 8px 0' }}>{title}</h4>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#888', margin: 0, lineHeight: 1.4 }}>{desc}</p>
            </div>
            {arrow && (
                <div style={{ color: '#555', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</div>
            )}
        </div>
    );
}

function EvidenceCard({ type, color, bg, border, desc, example }) {
    return (
        <div style={{ border: `1px solid ${border}`, background: bg, padding: '24px' }}>
            <div style={{ display: 'inline-block', border: `1px solid ${color}`, color: color, padding: '4px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '16px' }}>
                {type}
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#ddd', marginBottom: '16px', lineHeight: 1.5 }}>
                {desc}
            </p>
            <div style={{ background: '#000', border: '1px solid #333', padding: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Example Finding</span>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#bbb' }}>{example}</code>
            </div>
        </div>
    );
}

export default function ThreatIntel() {
    const W = { maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)', paddingBottom: '100px' }}>
            
            {/* Header / Hero */}
            <section style={{ borderBottom: '1px solid var(--color-border)', paddingTop: '40px', background: 'radial-gradient(circle at 50% 0%, #1a0505 0%, #000 70%)' }}>
                <div style={{ ...W }}>
                    <div className="terminal-label" style={{ marginBottom: '24px', color: 'var(--color-accent)' }}>SOC EDUCATIONAL HUB</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '24px' }}>
                        Engine Methodology <span style={{ color: 'var(--color-text-muted)' }}>// HANDBOOK</span>
                    </h1>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#aaa', lineHeight: 1.6, maxWidth: '800px', marginBottom: '32px' }}>
                        Bridging the gap between raw data and actionable intelligence. This hub explains how the ETH engine parses telemetry, classifies evidence, and constructs predictive threat models.
                    </p>
                </div>
            </section>

            {/* LEARNING DIRECTORY BANNER */}
            <section style={{ borderBottom: '1px solid var(--color-border)', background: '#0a0a0a', padding: '24px 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-warning)', border: '1px solid var(--color-warning)', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>LOOKING FOR TERMINOLOGY?</span>
                        <span style={{ fontFamily: 'var(--font-sans)', color: '#ccc', fontSize: '0.95rem' }}>Explore attacker behaviors, TTPs, and definitions in our interactive matrix pages:</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Link to="/killchain" style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.2s', ':hover': { background: '#222', borderColor: '#555' } }}>
                            EXPLORE KILL CHAIN →
                        </Link>
                        <Link to="/tactics" style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.2s', ':hover': { background: '#222', borderColor: '#555' } }}>
                            ENTERPRISE TACTICS →
                        </Link>
                    </div>
                </div>
            </section>

            {/* 1. HOW ETH WORKS */}
            <section style={{ borderBottom: '1px solid var(--color-border)', background: '#050505' }}>
                <div style={{ ...W }}>
                    <SectionHeading 
                        title="1. How ETH Thinks" 
                        subtitle="The 6-Layer Intelligence Architecture driving the engine." 
                    />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '48px' }}>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <PipelineStep step="1" title="Data Acquisition" desc="The engine parses provided ports, misconfigurations, and raw log text into structured data." arrow={true} />
                            <PipelineStep step="2" title="Evidence Validation" desc="Hashes are validated, IPs are extracted, and false positives are filtered out." arrow={true} />
                            <PipelineStep step="3" title="Threat Correlation" desc="Independent findings (e.g., Port 3389 + No MFA) are linked into realistic threat scenarios." arrow={false} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4 mt-8 lg:mt-0">
                            <PipelineStep step="4" title="MITRE Mapping" desc="Validated threats are mapped to strict MITRE ATT&CK tactics (e.g., TA0001, T1110)." arrow={true} />
                            <PipelineStep step="5" title="Attack Generation" desc="A standardized 7-phase cyber kill chain is assembled, separating facts from predictions." arrow={true} />
                            <PipelineStep step="6" title="Risk Scoring" desc="A final dynamic score is calculated based on exposure, exploitability, and telemetry." arrow={false} />
                        </div>
                    </div>

                    <div style={{ marginTop: '48px', background: '#111', padding: '32px', border: '1px solid #333' }}>
                        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#fff', marginBottom: '16px' }}>The Philosophy of the Engine</h4>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#bbb', lineHeight: 1.6, marginBottom: '16px' }}>
                            ETH is designed to behave like a <strong>Senior SOC Analyst</strong>. It does not exaggerate or invent cinematic breach narratives. If you do not provide telemetry proving a system was hacked, ETH will not claim it was hacked.
                        </p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#bbb', lineHeight: 1.6 }}>
                            Instead, it focuses on <strong>Exposure Management and Predictive Modeling</strong>. It tells you exactly what attackers <em>could</em> do with your current security posture, while clearly flagging the things attackers <em>are</em> doing based on your logs.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. VERIFIED VS INFERRED */}
            <section style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ ...W }}>
                    <SectionHeading 
                        title="2. Evidence Classification" 
                        subtitle="How ETH separates hard facts from threat modeling." 
                    />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <EvidenceCard 
                            type="VERIFIED" 
                            color="var(--color-success)" 
                            bg="rgba(0,255,157,0.03)" 
                            border="var(--color-success)"
                            desc="Findings directly observed in the data you provided. These are hard facts. If the engine flags something as VERIFIED, it means there is undeniable proof in your inputs."
                            example="Log snippet contains: 'UNION ALL SELECT password FROM users'"
                        />
                        <EvidenceCard 
                            type="INFERRED" 
                            color="var(--color-warning)" 
                            bg="rgba(255,170,0,0.03)" 
                            border="var(--color-warning)"
                            desc="Findings logically derived from your data using threat correlation. While not directly stated, the engine knows that X + Y almost always equals Z in the cybersecurity world."
                            example="You input: 'Port 3389' + 'No MFA'. ETH Infers: 'High Brute Force Risk'."
                        />
                        <EvidenceCard 
                            type="POTENTIAL" 
                            color="var(--color-info)" 
                            bg="rgba(0,170,255,0.03)" 
                            border="var(--color-info)"
                            desc="Hypothetical threat modeling. These are actions an attacker is highly likely to take in the future if they exploit the verified or inferred weaknesses."
                            example="If you have an exposed database, ETH models 'Data Exfiltration' as a potential future phase."
                        />
                    </div>
                </div>
            </section>

            {/* 3. ANALYST HANDBOOK (READING & INPUT) */}
            <section style={{ borderBottom: '1px solid var(--color-border)', background: '#050505' }}>
                <div style={{ ...W }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                        
                        {/* 3A. Reading Output */}
                        <div>
                            <SectionHeading title="3. Reading the Output" subtitle="Understanding your analysis report." />
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: 0, margin: 0, listStyle: 'none' }}>
                                <li>
                                    <h4 style={{ fontFamily: 'var(--font-sans)', color: '#fff', fontSize: '1.05rem', margin: '0 0 4px 0' }}>Overall Risk Score</h4>
                                    <p style={{ fontFamily: 'var(--font-sans)', color: '#888', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>A 0-100 metric determining your general exposure. Over 80 requires immediate action.</p>
                                </li>
                                <li>
                                    <h4 style={{ fontFamily: 'var(--font-sans)', color: '#fff', fontSize: '1.05rem', margin: '0 0 4px 0' }}>Assessment Confidence</h4>
                                    <p style={{ fontFamily: 'var(--font-sans)', color: '#888', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>Represents how confident the engine is in its own analysis based on the volume of data you provided. Clean, detailed logs yield 90%+ confidence.</p>
                                </li>
                                <li>
                                    <h4 style={{ fontFamily: 'var(--font-sans)', color: '#fff', fontSize: '1.05rem', margin: '0 0 4px 0' }}>Attack Graph</h4>
                                    <p style={{ fontFamily: 'var(--font-sans)', color: '#888', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>Visualizes how an attacker moves from the Internet (left) through exposed services into deeper kill-chain phases (right). Thicker red lines mean higher likelihood.</p>
                                </li>
                                <li>
                                    <h4 style={{ fontFamily: 'var(--font-sans)', color: '#fff', fontSize: '1.05rem', margin: '0 0 4px 0' }}>Remediation Priority</h4>
                                    <p style={{ fontFamily: 'var(--font-sans)', color: '#888', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>Always tackle 'Critical' remediations first. These are the single points of failure enabling the rest of the attack chain.</p>
                                </li>
                            </ul>
                        </div>

                        {/* 3B. Input Quality */}
                        <div>
                            <SectionHeading title="4. Input Quality" subtitle="Garbage in, garbage out." />
                            
                            <div style={{ border: '1px solid var(--color-success)', background: 'rgba(0,255,0,0.05)', padding: '16px', marginBottom: '16px' }}>
                                <h4 style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-success)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>Good Inputs</h4>
                                <ul style={{ fontFamily: 'var(--font-sans)', color: '#ccc', fontSize: '0.9rem', margin: 0, paddingLeft: '20px', lineHeight: 1.5 }}>
                                    <li>Real server access logs (Nginx/Apache)</li>
                                    <li>Raw Windows Event Logs or Syslog snippets</li>
                                    <li>Specific ports coupled with related misconfigurations</li>
                                    <li>Logs containing IPs, URLs, or hashes</li>
                                </ul>
                            </div>

                            <div style={{ border: '1px solid var(--color-danger)', background: 'rgba(255,0,0,0.05)', padding: '16px' }}>
                                <h4 style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-danger)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>Bad Inputs</h4>
                                <ul style={{ fontFamily: 'var(--font-sans)', color: '#ccc', fontSize: '0.9rem', margin: 0, paddingLeft: '20px', lineHeight: 1.5 }}>
                                    <li>"My computer was hacked by anonymous." (Too vague)</li>
                                    <li>Pasting an entire Wikipedia article. (Irrelevant)</li>
                                    <li>Claiming ransomware exists without log evidence. (Engine will downgrade this to 'Hypothetical')</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CORRELATION EXPLAINER */}
            <section>
                <div style={{ ...W }}>
                    <SectionHeading 
                        title="5. The Power of Correlation" 
                        subtitle="Why isolated weaknesses create critical vulnerabilities." 
                    />
                    <div className="flex flex-col lg:flex-row items-center justify-between bg-[#0a0a0a] border border-[#222] p-10 rounded-md gap-5">
                        
                        <div style={{ textAlign: 'center', flex: 1, width: '100%' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: '#fff', border: '1px solid #444', padding: '16px', background: '#111' }}>
                                Port 3389 (RDP) Exposed
                            </div>
                            <span style={{ display: 'block', marginTop: '12px', fontSize: '0.8rem', color: '#666' }}>Harmless on its own?</span>
                        </div>

                        <div style={{ fontSize: '2rem', color: '#444' }} className="rotate-90 lg:rotate-0">+</div>

                        <div style={{ textAlign: 'center', flex: 1, width: '100%' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: '#fff', border: '1px solid #444', padding: '16px', background: '#111' }}>
                                Lack of MFA
                            </div>
                            <span style={{ display: 'block', marginTop: '12px', fontSize: '0.8rem', color: '#666' }}>Common misconfiguration</span>
                        </div>

                        <div style={{ fontSize: '2rem', color: '#444' }} className="rotate-90 lg:rotate-0">=</div>

                        <div style={{ textAlign: 'center', flex: 1.2, width: '100%' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', padding: '16px', background: 'rgba(255,0,0,0.05)', fontWeight: 'bold' }}>
                                Ransomware Ingress Risk
                            </div>
                            <span style={{ display: 'block', marginTop: '12px', fontSize: '0.8rem', color: '#999' }}>Engine correlates these to model T1110 (Brute Force) leading directly to TA0040 (Impact).</span>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}
