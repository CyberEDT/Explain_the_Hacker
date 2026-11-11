import React from 'react';
import HeroSection from '../components/killchain/HeroSection';
import InteractiveChain from '../components/killchain/InteractiveChain';
import StorySimulator from '../components/killchain/StorySimulator';
import ComparisonSection from '../components/killchain/ComparisonSection';
import VisualAnalytics from '../components/killchain/VisualAnalytics';

import SEO from '@/components/SEO';

export default function KillChain() {
    const schemaOrg = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": "Cyber Kill Chain Visualizer",
        "description": "Interactive learning resource to explore the 7-phase cyber attack chain.",
        "author": {
            "@type": "Organization",
            "name": "CyberEDT",
            "url": "https://www.cyberedt.com/"
        }
    };

    return (
        <main style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>
            <SEO 
                title="Cyber Kill Chain & Attack Paths Explained | ETH"
                description="Understand the 7-phase cyber kill chain and multi-stage attack paths with interactive visual simulations and defensive insights from ETH."
                keywords="cyber kill chain explained, attack path visualization, cyber attack simulation, intrusion kill chain, MITRE ATT&CK"
                canonicalUrl="/killchain"
                schema={schemaOrg}
            />
            <HeroSection />
            <InteractiveChain />
            <StorySimulator />
            <ComparisonSection />
            <VisualAnalytics />
        </main>
    );
}
