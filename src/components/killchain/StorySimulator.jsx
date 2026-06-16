import React, { useState, useEffect } from 'react';
import { ATTACK_STORIES, KILL_CHAIN_STAGES } from '../../data/killChainDetailedData';

export default function StorySimulator() {
    const [activeStoryIdx, setActiveStoryIdx] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const story = ATTACK_STORIES[activeStoryIdx];

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev >= story.steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, story.steps.length]);

    const handlePlayPause = () => {
        if (currentStep >= story.steps.length - 1 && !isPlaying) {
            setCurrentStep(0);
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <section style={{ padding: '80px 32px', background: '#050505', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                    <div>
                        <div className="terminal-label" style={{ marginBottom: '16px', color: '#00aaff' }}>ATTACK STORY SIMULATOR</div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#fff', textTransform: 'uppercase' }}>
                            Watch It Unfold
                        </h2>
                    </div>
                    
                    {/* Story Selector */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {ATTACK_STORIES.map((s, i) => (
                            <button 
                                key={s.id}
                                onClick={() => { setActiveStoryIdx(i); setCurrentStep(0); setIsPlaying(false); }}
                                style={{
                                    background: activeStoryIdx === i ? '#fff' : 'transparent',
                                    color: activeStoryIdx === i ? '#000' : '#888',
                                    border: `1px solid ${activeStoryIdx === i ? '#fff' : '#333'}`,
                                    padding: '8px 16px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '48px', position: 'relative' }}>
                    {/* Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
                        <button 
                            onClick={handlePlayPause}
                            style={{
                                background: '#ff0033',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 32px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                borderRadius: '2px',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {isPlaying ? 'PAUSE' : (currentStep >= story.steps.length - 1 ? 'REPLAY' : 'PLAY SIMULATION')}
                        </button>
                    </div>

                    {/* Timeline */}
                    <div style={{ position: 'relative', padding: '20px 0' }}>
                        {/* Connecting Line Base */}
                        <div style={{ 
                            position: 'absolute', 
                            top: '32px', left: '0', right: '0', 
                            height: '2px', 
                            background: '#222', 
                            transform: 'translateY(-50%)',
                            zIndex: 0
                        }} />
                        
                        {/* Connecting Line Active */}
                        <div style={{ 
                            position: 'absolute', 
                            top: '32px', left: '0', 
                            width: `${(currentStep / (story.steps.length - 1)) * 100}%`,
                            height: '2px', 
                            background: '#00aaff', 
                            transform: 'translateY(-50%)',
                            zIndex: 1,
                            transition: 'width 0.5s ease'
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                            {story.steps.map((step, idx) => {
                                const stageMeta = KILL_CHAIN_STAGES.find(k => k.id === step.stage);
                                const isPast = idx <= currentStep;
                                const isCurrent = idx === currentStep;

                                return (
                                    <div key={idx} style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        width: '120px',
                                        textAlign: 'center',
                                        opacity: isPast ? 1 : 0.4,
                                        transition: 'all 0.3s ease',
                                        transform: isCurrent ? 'scale(1.1)' : 'scale(1)'
                                    }}>
                                        {/* Node */}
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: isCurrent ? stageMeta.color : (isPast ? '#111' : '#050505'),
                                            border: `2px solid ${isPast ? stageMeta.color : '#333'}`,
                                            marginBottom: '16px',
                                            boxShadow: isCurrent ? `0 0 15px ${stageMeta.color}` : 'none'
                                        }} />
                                        
                                        {/* Labels */}
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: stageMeta.color, marginBottom: '8px' }}>
                                            {stageMeta.title}
                                        </div>
                                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: isCurrent ? '#fff' : '#888', lineHeight: 1.4 }}>
                                            {step.desc}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
