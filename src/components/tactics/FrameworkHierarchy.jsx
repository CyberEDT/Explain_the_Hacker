import React, { useState } from 'react';
import { Network, Server, FileCode, TerminalSquare } from 'lucide-react';

const HIERARCHY = [
    {
        id: 'tactic',
        label: 'TACTIC',
        icon: <Network size={20} />,
        question: 'Why?',
        definition: 'The adversary\'s tactical goal. The reason for performing an action. Example: The attacker needs to maintain access to the network.',
        example: 'Persistence (TA0003)'
    },
    {
        id: 'technique',
        label: 'TECHNIQUE',
        icon: <Server size={20} />,
        question: 'How?',
        definition: 'The means by which adversaries achieve a tactical goal. Example: The attacker modifies a system process to run their code.',
        example: 'Create or Modify System Process (T1543)'
    },
    {
        id: 'subtechnique',
        label: 'SUB-TECHNIQUE',
        icon: <FileCode size={20} />,
        question: 'How exactly?',
        definition: 'A more specific description of the behavior used to achieve a goal. Example: The attacker specifically modifies a Windows service.',
        example: 'Windows Service (T1543.003)'
    },
    {
        id: 'procedure',
        label: 'PROCEDURE',
        icon: <TerminalSquare size={20} />,
        question: 'What did they type?',
        definition: 'The exact step-by-step instructions, tools, or commands the adversary used. This is what defenders actually observe in the logs.',
        example: 'sc.exe create malicious_svc binPath= "C:\\malware.exe"'
    }
];

export default function FrameworkHierarchy() {
    const [activeId, setActiveId] = useState('tactic');

    return (
        <section style={{ padding: '80px 32px', borderBottom: '1px solid #111', background: '#0a0a0a' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', color: '#fff', textTransform: 'uppercase', marginBottom: '16px' }}>
                        The Framework Hierarchy
                    </h2>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#888', maxWidth: '600px', margin: '0 auto' }}>
                        Before analyzing the matrix, you must understand the relationship between Tactics, Techniques, and Procedures (TTPs).
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Interactive Flowchart */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {HIERARCHY.map((item, index) => {
                            const isActive = activeId === item.id;
                            return (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
                                    {/* Timeline Line & Node */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '24px', position: 'relative' }}>
                                        <div style={{ 
                                            width: '40px', height: '40px', borderRadius: '50%', 
                                            background: isActive ? '#ff0033' : '#1a1a1a',
                                            border: `2px solid ${isActive ? '#ff0033' : '#333'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: isActive ? '#fff' : '#666',
                                            transition: 'all 0.3s ease',
                                            zIndex: 2,
                                            cursor: 'pointer'
                                        }} onClick={() => setActiveId(item.id)}>
                                            {item.icon}
                                        </div>
                                        {index !== HIERARCHY.length - 1 && (
                                            <div style={{ width: '2px', height: '60px', background: isActive ? '#ff0033' : '#222', transition: 'background 0.3s ease' }} />
                                        )}
                                    </div>

                                    {/* Content Card */}
                                    <div 
                                        onClick={() => setActiveId(item.id)}
                                        style={{ 
                                            flex: 1, 
                                            padding: '20px', 
                                            background: isActive ? 'rgba(255,0,51,0.05)' : '#050505',
                                            border: `1px solid ${isActive ? 'rgba(255,0,51,0.3)' : '#1a1a1a'}`,
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            transform: isActive ? 'translateX(8px)' : 'translateX(0)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: isActive ? '#fff' : '#888', fontWeight: 'bold' }}>
                                                {item.label}
                                            </h3>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: isActive ? '#ffaa00' : '#444' }}>
                                                {item.question}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Dynamic Detail Panel */}
                    <div style={{ 
                        background: '#050505', 
                        border: '1px solid #2a2a2a', 
                        padding: '40px', 
                        minHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative grid */}
                        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, opacity: 0.05, pointerEvents: 'none', backgroundSize: '20px 20px', backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)' }} />
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div className="terminal-label" style={{ color: '#ff0033', marginBottom: '16px' }}>SELECTED: {HIERARCHY.find(h => h.id === activeId)?.label}</div>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#ddd', lineHeight: 1.6, marginBottom: '32px' }}>
                                {HIERARCHY.find(h => h.id === activeId)?.definition}
                            </p>
                            <div style={{ background: '#000', border: '1px solid #222', padding: '16px', borderLeft: '3px solid #ffaa00' }}>
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Example Mapping</p>
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#fff' }}>
                                    {HIERARCHY.find(h => h.id === activeId)?.example}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
