import { Link } from 'react-router-dom';

export default function PlatformLayout({ children }) {

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
        >
            {/* ── Navbar ──────────────────────────────────────────────────── */}
            <nav
                className="sticky top-0 z-50"
                style={{
                    background: '#000',
                    borderBottom: '1px solid var(--color-border)',
                }}
            >
                <div
                    className="mx-auto px-8 flex items-center justify-between"
                    style={{ maxWidth: '1400px', height: '56px' }}
                >
                    {/* Logo: EXPLAIN_THE_HACKER_ with blinking cursor */}
                    <Link
                        to="/"
                        className="flex items-center"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#fff',
                            letterSpacing: '0.05em',
                            textDecoration: 'none',
                        }}
                    >
                        EXPLAIN_THE_HACKER
                        <span
                            style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '14px',
                                background: 'var(--color-accent)',
                                marginLeft: '2px',
                                animation: 'blink 1s step-end infinite',
                                verticalAlign: 'middle',
                            }}
                        />
                    </Link>

                    {/* Nav links */}
                    <div className="flex items-center gap-8">
                        {[
                            { label: 'ETH ENGINE', href: '/lab' },
                            { label: 'KILL CHAIN', href: '/#killchain' },
                            { label: 'TACTICS', href: '/#tactics' },
                            { label: 'THREAT INTEL', href: '/threat-intel' },
                            { label: 'LIBRARY', href: '/library' },
                            { label: 'ROADMAP', href: '/roadmap' },
                            { label: 'CYBEREDT', href: 'https://www.cyberedt.com' },
                        ].map(({ label, href }) => {
                            const isExternal = href.startsWith('http');
                            const style = {
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: 'var(--color-text-secondary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                textDecoration: 'none',
                                transition: 'color 0.2s ease',
                            };
                            
                            return isExternal ? (
                                <a
                                    key={label}
                                    href={href}
                                    style={style}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                                >
                                    {label}
                                </a>
                            ) : (
                                <Link
                                    key={label}
                                    to={href}
                                    style={style}
                                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                                >
                                    {label}
                                </Link>
                            );
                        })}

                    </div>
                </div>
            </nav>

            {/* ── Ticker ──────────────────────────────────────────────────── */}
            <div
                className="overflow-hidden"
                style={{
                    background: '#000',
                    borderBottom: '1px solid var(--color-border)',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="ticker-wrap">
                    <div
                        className="ticker font-mono text-xs"
                        style={{ color: 'var(--color-text-muted)', fontSize: '0.65rem', letterSpacing: '0.08em' }}
                    >
                        {[
                            { label: 'MITIGATED', color: 'var(--color-success)', text: 'Ransomware — Finance sector lateral movement blocked' },
                            { label: 'DETECTED', color: 'var(--color-warning)', text: 'APT group — Spear-phishing campaign against healthcare' },
                            { label: 'CRITICAL', color: 'var(--color-accent)', text: 'Nation-state — Zero-day exploit targeting energy grid' },
                            { label: 'DETECTED', color: 'var(--color-warning)', text: 'Supply chain attack — Trojanized software update' },
                            { label: 'MITIGATED', color: 'var(--color-success)', text: 'Credential theft — Brute force on exposed RDP port' },
                            { label: 'CRITICAL', color: 'var(--color-accent)', text: 'C2 beaconing — Cobalt Strike detected in corporate network' },
                            { label: 'DETECTED', color: 'var(--color-warning)', text: 'Data exfiltration — Sensitive PII leaving network perimeter' },
                        ]
                            .flatMap((item) => [item, item])
                            .map((item, i) => (
                                <span key={i} className="ticker-item">
                                    <span
                                        className="font-bold mr-2"
                                        style={{ color: item.color, letterSpacing: '0.1em' }}
                                    >
                                        {item.label}
                                    </span>
                                    {item.text}
                                </span>
                            ))}
                    </div>
                </div>
            </div>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>

            <footer style={{
                background: '#050505',
                borderTop: '1px solid var(--color-border)',
                padding: '48px 32px 32px 32px',
                marginTop: 'auto'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
                        
                        {/* Platform */}
                        <div>
                            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Platform</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li><Link to="/lab" className="footer-link">ETH Engine</Link></li>
                                <li><Link to="/threat-intel" className="footer-link">Threat Intel</Link></li>
                                <li><Link to="/roadmap" className="footer-link">Roadmap</Link></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Legal & Policy</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
                                <li><Link to="/ethics" className="footer-link">Responsible Usage</Link></li>
                                <li><Link to="/disclaimer" className="footer-link">Security Disclaimer</Link></li>
                            </ul>
                        </div>

                        {/* CyberEDT */}
                        <div>
                            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>CyberEDT</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li><a href="https://www.cyberedt.com" className="footer-link">About CyberEDT</a></li>
                                <li><a href="#" className="footer-link">Contact</a></li>
                                <li><a href="https://github.com/CyberEDT" className="footer-link">GitHub</a></li>
                                <li><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#555' }}>v3.0.0 (Enterprise Beta)</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Disclaimer Area */}
                    <div style={{
                        borderTop: '1px solid #1a1a1a', paddingTop: '24px',
                        display: 'flex', flexDirection: 'column', gap: '8px',
                        fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#666', letterSpacing: '0.05em'
                    }}>
                        <p style={{ margin: 0 }}>
                            <strong style={{ color: '#888' }}>DISCLAIMER:</strong> ETH provides AI-assisted cybersecurity analysis and predictive threat modeling. Some findings may be inferred or hypothetical.
                        </p>
                        <p style={{ margin: 0 }}>
                            For educational, defensive, and authorized security analysis purposes only. © 2026 CyberEDT.
                        </p>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                    .footer-link {
                        font-family: var(--font-sans);
                        font-size: 0.85rem;
                        color: #888;
                        text-decoration: none;
                        transition: color 0.2s ease, text-shadow 0.2s ease;
                    }
                    .footer-link:hover {
                        color: #fff;
                        text-shadow: 0 0 8px rgba(255,255,255,0.2);
                    }
                `}} />
            </footer>
        </div>
    );
}
