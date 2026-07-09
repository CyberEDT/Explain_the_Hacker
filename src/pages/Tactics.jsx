import React, { useEffect } from 'react';
import TacticsHero from '../components/tactics/TacticsHero';
import FrameworkHierarchy from '../components/tactics/FrameworkHierarchy';
import ObjectiveExplorer from '../components/tactics/ObjectiveExplorer';
import TacticsGrid from '../components/tactics/TacticsGrid';
import TacticsVisualizations from '../components/tactics/TacticsVisualizations';

import SEO from '@/components/SEO';

export default function Tactics() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const schemaOrg = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "MITRE ATT&CK Enterprise Tactics",
        "description": "A comprehensive directory and visualizer for MITRE ATT&CK enterprise tactics.",
        "author": {
            "@type": "Organization",
            "name": "CyberEDT",
            "url": "https://www.cyberedt.com/"
        }
    };

    return (
        <main style={{ background: '#050505', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
            <SEO 
                title="MITRE ATT&CK Tactics Explorer" 
                description="Explore enterprise tactics and adversary objectives through interactive MITRE ATT&CK visualizations."
                canonicalUrl="/tactics"
                schema={schemaOrg}
            />
            <TacticsHero />
            <FrameworkHierarchy />
            <ObjectiveExplorer />
            <TacticsGrid />
            <TacticsVisualizations />
        </main>
    );
}
