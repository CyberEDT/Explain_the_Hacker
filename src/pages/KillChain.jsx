import React from 'react';
import HeroSection from '../components/killchain/HeroSection';
import InteractiveChain from '../components/killchain/InteractiveChain';
import StorySimulator from '../components/killchain/StorySimulator';
import ComparisonSection from '../components/killchain/ComparisonSection';
import VisualAnalytics from '../components/killchain/VisualAnalytics';

export default function KillChain() {
    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>
            <HeroSection />
            <InteractiveChain />
            <StorySimulator />
            <ComparisonSection />
            <VisualAnalytics />
        </div>
    );
}
