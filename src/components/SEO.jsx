import { Helmet } from 'react-helmet-async';

export default function SEO({ 
    title, 
    description, 
    canonicalUrl, 
    ogType = 'website',
    ogImage = 'https://explainthehacker.cyberedt.com/favicon.png',
    schema = null,
    keywords = "Explain The Hacker, CyberEDT, cybersecurity, hacker simulation, attack chain, MITRE ATT&CK, threat analysis, penetration testing"
}) {
    const siteName = "CyberEDT";
    const fullTitle = `${title} | ${siteName} Attacker Intelligence Platform`;
    const canonical = canonicalUrl ? `https://explainthehacker.cyberedt.com${canonicalUrl}` : 'https://explainthehacker.cyberedt.com/';

    return (
        <Helmet>
            {/* Standard SEO */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={siteName} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@CyberEDT" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data (JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
}
