import React, { useEffect } from 'react';
import TacticsHero from '../components/tactics/TacticsHero';
import FrameworkHierarchy from '../components/tactics/FrameworkHierarchy';
import ObjectiveExplorer from '../components/tactics/ObjectiveExplorer';
import TacticsGrid from '../components/tactics/TacticsGrid';
import TacticsVisualizations from '../components/tactics/TacticsVisualizations';

export default function Tactics() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ background: '#050505', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
            <TacticsHero />
            <FrameworkHierarchy />
            <ObjectiveExplorer />
            <TacticsGrid />
            <TacticsVisualizations />
        </div>
    );
}
