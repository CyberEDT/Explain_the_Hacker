import { useState, useRef, useCallback, useEffect } from 'react';
import { MISCONFIGURATION_SUGGESTIONS, PORT_PRESETS } from './validationSchema';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css';

// ─── Quick-add port numbers ───────────────────────────────────────────────────
const QUICK_PORTS = ['22', '80', '443', '3389', '8080', '5432'];

// ─── Icons ────────────────────────────────────────────────────────────────────
function XIcon({ size = 10 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
function PlusIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}
function PlayIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
        </svg>
    );
}
function AlertIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}

// ─── Section Header — matches reference: [01] badge + title + subtitle ────────
// Reference: flex items-baseline justify-between mb-1
//            [01] badge: bg-accent text-accent-foreground size-6 inline-flex ...
//            Title: font-bold uppercase tracking-tight text-xl
function SectionHeader({ number, title, subtitle, count, max }) {
    const atMax = count >= max;
    return (
        <>
            {/* Reference: flex items-baseline justify-between mb-1 */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Reference: font-mono text-[10px] bg-accent text-accent-foreground size-6 inline-flex items-center justify-center font-bold */}
                    <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700,
                        background: '#e8183a', color: '#fff',
                        width: '24px', height: '24px',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        letterSpacing: '0.02em',
                    }}>
                        {number}
                    </span>
                    {/* Reference: font-bold uppercase tracking-tight text-xl */}
                    <h2 style={{
                        fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0, color: '#fff',
                    }}>
                        {title}
                    </h2>
                </div>
                {/* Reference: font-mono text-[10px] text-muted-foreground */}
                {max !== undefined && (
                    <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                        color: atMax ? '#ff0033' : '#444', letterSpacing: '0.06em',
                    }}>
                        {count}/{max}
                    </span>
                )}
            </div>
            {/* Reference: font-mono text-[11px] text-muted-foreground mb-4 ml-9 */}
            {subtitle && (
                <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                    color: '#555', marginBottom: '16px', marginLeft: '36px',
                    letterSpacing: '0.02em',
                }}>
                    {subtitle}
                </p>
            )}
        </>
    );
}

// ─── Intelligence Level Selector ──────────────────────────────────────────────

function IntelligenceLevelSelector({ value, onChange }) {
    const levels = [
        { id: 'LOW', label: 'LOW', desc: 'Beginner-friendly, minimal jargon' },
        { id: 'MEDIUM', label: 'MEDIUM', desc: 'Operational security context' },
        { id: 'HIGH', label: 'HIGH', desc: 'Research-grade threat intel' },
        { id: 'LE', label: 'LAW ENFORCEMENT', desc: 'Investigation & forensics focus' }
    ];

    return (
        <div style={{ background: '#000', padding: '24px', borderBottom: '1px solid #1a1a1a' }}>
            <SectionHeader
                number="00"
                title="Intelligence Level"
                subtitle="Select the depth and complexity of the resulting intelligence report."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {levels.map(level => {
                    const isSelected = value === level.id;
                    return (
                        <button
                            key={level.id}
                            type="button"
                            onClick={() => onChange(level.id)}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px',
                                padding: '16px', textAlign: 'left',
                                background: isSelected ? 'rgba(0, 170, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                border: `1px solid ${isSelected ? '#00aaff' : '#222'}`,
                                color: isSelected ? '#fff' : '#888',
                                cursor: 'pointer', transition: 'all 0.2s ease-in-out',
                                outline: 'none'
                            }}
                            onMouseEnter={e => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.borderColor = '#444';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                    e.currentTarget.style.borderColor = '#222';
                                }
                            }}
                        >
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                                {level.label}
                            </span>
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: isSelected ? '#aaa' : '#666' }}>
                                {level.desc}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────
function Tag({ label, onRemove, id }) {
    const [hovered, setHovered] = useState(false);
    return (
        <span
            id={id}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 8px',
                background: 'transparent', color: '#ccc',
                border: '1px solid rgba(255,255,255,0.15)',
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                fontWeight: 500, letterSpacing: '0.02em', userSelect: 'none',
            }}
        >
            {label}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Remove ${label}`}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: hovered ? '#ff0033' : '#666',
                        padding: 0, lineHeight: 1, transition: 'color 0.15s',
                    }}
                >
                    <XIcon size={10} />
                </button>
            )}
        </span>
    );
}

// ─── Field error ──────────────────────────────────────────────────────────────
function FieldError({ message }) {
    if (!message) return null;
    return (
        <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#ff0033', marginTop: '6px' }}>
            <AlertIcon /> {message}
        </p>
    );
}

// ─── Section 1: Open Ports ────────────────────────────────────────────────────
// Reference: ml-0 lg:ml-9 border border-border p-3 min-h-[60px] flex flex-wrap gap-2 items-center
function OpenPortsInput({ ports, onAddPort, onRemovePort, error }) {
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');
    const inputRef = useRef(null);

    const tryAdd = useCallback(() => {
        if (!inputValue.trim()) return;
        const parts = inputValue.split(/[\s,]+/).filter(Boolean);
        let lastErr = '';
        const failedParts = [];
        parts.forEach((part) => {
            const e = onAddPort(part);
            if (e) {
                lastErr = e;
                failedParts.push(part);
            }
        });
        setInputError(lastErr);
        if (failedParts.length > 0) {
            setInputValue(failedParts.join(', '));
        } else {
            setInputValue('');
        }
    }, [inputValue, onAddPort]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',' || e.key === ' ') { e.preventDefault(); tryAdd(); }
        if (e.key === 'Backspace' && !inputValue && ports.length > 0) onRemovePort(ports[ports.length - 1]);
    };

    return (
        <div className="ml-0 md:ml-9">
            {/* Reference: border border-border p-3 min-h-[60px] flex flex-wrap gap-2 items-center */}
            <div
                onClick={() => inputRef.current?.focus()}
                style={{
                    border: '1px solid #222',
                    padding: '12px',
                    minHeight: '60px',
                    display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
                    cursor: 'text',
                }}
            >
                {ports.map(p => (
                    <Tag key={p} id={`port-tag-${p}`} label={p} onRemove={() => onRemovePort(p)} />
                ))}
                {ports.length < 50 && (
                    <input
                        ref={inputRef}
                        id="port-input"
                        type="text"
                        inputMode="numeric"
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value.replace(/[^0-9,\s]/g, '')); setInputError(''); }}
                        onKeyDown={handleKeyDown}
                        onBlur={tryAdd}
                        placeholder={ports.length === 0 ? 'e.g. 22, 80, 443…' : ''}
                        style={{
                            flex: 1, minWidth: '120px',
                            background: 'transparent', border: 'none', outline: 'none',
                            fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                            color: '#ccc', padding: '2px 0',
                        }}
                        aria-label="Add port number"
                    />
                )}
            </div>

            {inputError && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#ff0033', marginTop: '6px' }}>
                    <AlertIcon /> {inputError}
                </p>
            )}

            {/* Quick Add row — reference: mt-3 flex items-center gap-2 flex-wrap */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {/* Reference: font-mono text-[10px] text-muted-foreground uppercase tracking-widest */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.2em', flexShrink: 0 }}>
                    Quick add:
                </span>
                {QUICK_PORTS.map(p => {
                    const already = ports.includes(p);
                    return (
                        <button
                            key={p}
                            type="button"
                            id={`quick-port-${p}`}
                            disabled={already || ports.length >= 50}
                            onClick={() => onAddPort(p)}
                            style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 500,
                                color: already ? '#333' : '#aaa',
                                background: 'transparent',
                                /* Reference: border border-white/15 px-2 py-1 hover:bg-foreground hover:text-background */
                                border: `1px solid ${already ? '#1a1a1a' : 'rgba(255,255,255,0.15)'}`,
                                padding: '4px 8px', cursor: already ? 'default' : 'pointer',
                                transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                                letterSpacing: '0.04em',
                            }}
                            onMouseEnter={e => { if (!already) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; } }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = already ? '#333' : '#aaa'; }}
                        >
                            {p}
                        </button>
                    );
                })}
                {ports.length > 0 && (
                    <button
                        type="button"
                        onClick={() => ports.forEach(onRemovePort)}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#ff0033', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    >
                        Clear
                    </button>
                )}
            </div>

            <FieldError message={error} />
        </div>
    );
}

// ─── Section 2: Known Misconfigurations ───────────────────────────────────────
function MisconfigurationsInput({ misconfigs, onAdd, onRemove, error }) {
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        if (!suggestionsOpen) return;
        const close = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setSuggestionsOpen(false); };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [suggestionsOpen]);

    const filtered = MISCONFIGURATION_SUGGESTIONS.filter(
        s => !misconfigs.includes(s) && (!inputValue.trim() || s.toLowerCase().includes(inputValue.toLowerCase()))
    ).slice(0, 50); // Limit to 50 items

    const tryAdd = useCallback((val = inputValue) => {
        const trimmed = val.trim();
        if (!trimmed) return;
        const err = onAdd(trimmed);
        if (err) { setInputError(err); }
        else { setInputValue(''); setInputError(''); setSuggestionsOpen(false); setHighlightedIndex(-1); }
    }, [inputValue, onAdd]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!suggestionsOpen) {
                setSuggestionsOpen(true);
            } else {
                setHighlightedIndex(prev => {
                    const next = Math.min(prev + 1, filtered.length - 1);
                    // scroll into view roughly
                    if (suggestionsRef.current) {
                        const el = suggestionsRef.current.children[next];
                        if (el) el.scrollIntoView({ block: 'nearest' });
                    }
                    return next;
                });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => {
                const next = Math.max(prev - 1, -1);
                if (suggestionsRef.current && next >= 0) {
                    const el = suggestionsRef.current.children[next];
                    if (el) el.scrollIntoView({ block: 'nearest' });
                }
                return next;
            });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (suggestionsOpen && highlightedIndex >= 0 && highlightedIndex < filtered.length) {
                tryAdd(filtered[highlightedIndex]);
            } else {
                tryAdd();
            }
        } else if (e.key === 'Escape') {
            setSuggestionsOpen(false);
            setHighlightedIndex(-1);
        } else if (e.key === 'Backspace' && !inputValue && misconfigs.length > 0) {
            onRemove(misconfigs[misconfigs.length - 1]);
        }
    };

    return (
        <div ref={wrapperRef} className="ml-0 md:ml-9">
            {/* Added tags */}
            {misconfigs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    {misconfigs.map(m => (
                        <Tag
                            key={m}
                            id={`misc-tag-${m.replace(/\s+/g, '-').toLowerCase()}`}
                            label={m}
                            onRemove={() => onRemove(m)}
                        />
                    ))}
                </div>
            )}

            {/* Input row — reference: flex gap-px bg-border */}
            <div style={{ display: 'flex', gap: '1px', background: '#1a1a1a', position: 'relative' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    {/* Reference: flex-1 bg-background px-3 py-2 outline-none font-mono text-sm placeholder:text-muted-foreground border border-border focus:border-accent transition-colors */}
                    <input
                        ref={inputRef}
                        type="text"
                        id="misconfig-input"
                        value={inputValue}
                        onChange={e => { setInputValue(e.target.value); setHighlightedIndex(-1); setSuggestionsOpen(true); setInputError(''); }}
                        onFocus={() => { setFocused(true); setSuggestionsOpen(true); }}
                        onBlur={() => setFocused(false)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. Default credentials not changed"
                        maxLength={200}
                        style={{
                            width: '100%',
                            background: '#000',
                            border: `1px solid ${focused ? '#e8183a' : '#222'}`,
                            outline: 'none',
                            fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                            color: '#ccc', padding: '10px 14px',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.15s',
                        }}
                    />

                    {/* Suggestions dropdown */}
                    {suggestionsOpen && filtered.length > 0 && (
                        <div ref={suggestionsRef} style={{
                            position: 'absolute', left: 0, top: '100%', width: '100%', zIndex: 50,
                            background: '#0a0a0a', border: '1px solid #2a2a2a',
                            maxHeight: '240px', overflowY: 'auto',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                        }}>
                            {filtered.map((s, idx) => (
                                <button
                                    type="button"
                                    key={s}
                                    onMouseDown={e => { e.preventDefault(); tryAdd(s); inputRef.current?.focus(); }}
                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                    style={{
                                        display: 'block', width: '100%', textAlign: 'left',
                                        padding: '10px 14px',
                                        background: highlightedIndex === idx ? '#1a0005' : 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid #141414',
                                        fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                                        color: highlightedIndex === idx ? '#fff' : '#888',
                                        cursor: 'pointer', transition: 'background 0.1s, color 0.1s',
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* + Add button — reference: bg-foreground text-background px-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground */}
                <button
                    type="button"
                    id="add-misconfig-btn"
                    onClick={() => { tryAdd(); setSuggestionsOpen(false); inputRef.current?.focus(); }}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '10px 16px',
                        background: '#fff', color: '#000',
                        border: 'none',
                        fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        cursor: 'pointer', flexShrink: 0,
                        transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e8183a'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                >
                    + Add
                </button>
            </div>

            {inputError && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#ff0033', marginTop: '6px' }}>
                    <AlertIcon /> {inputError}
                </p>
            )}
            <FieldError message={error} />
        </div>
    );
}

// ─── Section 3: Log Snippet ───────────────────────────────────────────────────
// Reference: textarea ml-0 lg:ml-9 w-... min-h-[180px] bg-white/5 border border-border focus:border-accent ...
const toolbarBtnStyle = {
    background: '#222', color: '#ccc', border: 'none', padding: '6px 12px',
    fontFamily: 'var(--font-mono)', fontSize: '0.7rem', cursor: 'pointer',
    textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'background 0.2s'
};

function LogSnippetTextarea({ value, onChange, error }) {
    const MAX = 500000;
    const [focused, setFocused] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1MB limit (1,048,576 bytes)
        if (file.size > 1048576) {
            alert('File is too large. Please upload a file smaller than 1MB.');
            // Clear the input so the same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            onChange(evt.target.result);
        };
        reader.readAsText(file);
    };

    const handleFormatJSON = () => {
        try {
            const parsed = JSON.parse(value);
            onChange(JSON.stringify(parsed, null, 2));
        } catch {
            alert('Could not format: Invalid JSON. Please make sure the input is valid JSON.');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        alert('Copied to clipboard!');
    };

    const handleClear = () => {
        onChange('');
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', marginLeft: '0', flexWrap: 'wrap' }} className="md:ml-9">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileUpload} 
                    accept=".txt,.log,.json,.csv"
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} style={toolbarBtnStyle}
                        onMouseEnter={e => e.currentTarget.style.background = '#444'} onMouseLeave={e => e.currentTarget.style.background = '#222'}>
                    Upload File
                </button>
                <button type="button" onClick={handleFormatJSON} style={toolbarBtnStyle}
                        onMouseEnter={e => e.currentTarget.style.background = '#444'} onMouseLeave={e => e.currentTarget.style.background = '#222'}>
                    Format JSON
                </button>
                <button type="button" onClick={handleCopy} style={toolbarBtnStyle}
                        onMouseEnter={e => e.currentTarget.style.background = '#444'} onMouseLeave={e => e.currentTarget.style.background = '#222'}>
                    Copy
                </button>
                <button type="button" onClick={handleClear} style={toolbarBtnStyle}
                        onMouseEnter={e => e.currentTarget.style.background = '#e8183a'} onMouseLeave={e => e.currentTarget.style.background = '#222'}>
                    Clear
                </button>
            </div>
            <div className="w-full ml-0 md:w-[calc(100%-36px)] md:ml-9" style={{
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${focused ? '#e8183a' : '#222'}`,
                transition: 'border-color 0.15s',
                position: 'relative',
                maxHeight: '400px',
                overflow: 'auto'
            }}>
                <textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="w-full h-full"
                    style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#888',
                        minHeight: '180px', lineHeight: 1.6, background: 'transparent', border: 'none', outline: 'none'
                    }}
                />
            </div>
            {/* Reference: font-mono text-[10px] text-muted-foreground mt-2 uppercase tracking-widest */}
            <div className="flex justify-between items-center mt-2 ml-0 md:ml-9">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Scripts and HTML tags are automatically stripped.
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444' }}>
                    {value.length.toLocaleString()}/{MAX.toLocaleString()}
                </span>
            </div>
            <FieldError message={error} />
        </div>
    );
}

export default function AttackSimulationForm({
    formValues,
    fieldErrors,
    loading,
    onAddPort,
    onAddPorts,
    onRemovePort,
    onAddMisconfiguration,
    onRemoveMisconfiguration,
    onLogSnippetChange,
    onIntelligenceLevelChange,
    onSubmit,
    onReset,
}) {
    const { openPorts, misconfigurations, logSnippet, intelligenceLevel } = formValues;
    const isEmpty = openPorts.length === 0 && misconfigurations.length === 0 && !logSnippet.trim();

    // Status summary
    const portSummary     = openPorts.length > 0 ? `${openPorts.length} port${openPorts.length > 1 ? 's' : ''}` : '0';
    const miscSummary     = misconfigurations.length > 0 ? `${misconfigurations.length}` : '0';
    const logSummary      = logSnippet.trim() ? 'log added' : 'no log';

    return (
        <form id="attack-simulation-form" onSubmit={onSubmit} noValidate
            style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a1a1a' }}>

            <IntelligenceLevelSelector 
                value={intelligenceLevel} 
                onChange={onIntelligenceLevelChange} 
            />

            {/* ── Section 01: Open Ports ── reference: bg-background p-6 ─────── */}
            <div style={{ background: '#000', padding: '24px' }}>
                <SectionHeader
                    number="01"
                    title="Open Ports"
                    subtitle="Type a port and press Enter or comma. Numeric 1–65535."
                    count={openPorts.length}
                    max={50}
                />
                <OpenPortsInput
                    ports={openPorts}
                    onAddPort={onAddPort}
                    onRemovePort={onRemovePort}
                    error={fieldErrors.openPorts}
                />
                {/* Port Preset Groups */}
                {onAddPorts && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.2em', flexShrink: 0 }}>
                            Presets:
                        </span>
                        {PORT_PRESETS.map(preset => (
                            <button
                                key={preset.label}
                                type="button"
                                title={`${preset.description}: ${preset.ports.join(', ')}`}
                                disabled={openPorts.length >= 50}
                                onClick={() => onAddPorts(preset.ports)}
                                style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 500,
                                    color: '#aaa', background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    padding: '4px 8px', cursor: openPorts.length >= 50 ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.15s, color 0.15s',
                                    letterSpacing: '0.04em', opacity: openPorts.length >= 50 ? 0.4 : 1,
                                }}
                                onMouseEnter={e => { if (openPorts.length < 50) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#aaa'; }}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Section 02: Known Misconfigurations ───────────────────────── */}
            <div style={{ background: '#000', padding: '24px' }}>
                <SectionHeader
                    number="02"
                    title="Known Misconfigurations"
                    subtitle="Add tags. HTML is stripped automatically."
                    count={misconfigurations.length}
                    max={20}
                />
                <MisconfigurationsInput
                    misconfigs={misconfigurations}
                    onAdd={onAddMisconfiguration}
                    onRemove={onRemoveMisconfiguration}
                    error={fieldErrors.misconfigurations}
                />
            </div>

            {/* ── Section 03: Log Snippet ─────────────────────────────────── */}
            <div style={{ background: '#000', padding: '24px' }}>
                <SectionHeader
                    number="03"
                    title="Log Snippet"
                    subtitle="Optional. Paste raw logs, IDS output, or firewall drops."
                    count={logSnippet.length}
                    max={500000}
                />
                <LogSnippetTextarea
                    value={logSnippet}
                    onChange={onLogSnippetChange}
                    error={fieldErrors.logSnippet}
                />
            </div>

            {/* Upload Disclaimer */}
            <div style={{
                background: 'rgba(255,170,0,0.05)',
                borderTop: '1px solid rgba(255,170,0,0.2)',
                borderBottom: '1px solid rgba(255,170,0,0.2)',
                padding: '16px 24px',
                display: 'flex', gap: '12px', alignItems: 'flex-start'
            }}>
                <span style={{ color: 'var(--color-warning)', marginTop: '2px' }}><AlertIcon /></span>
                <div>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                        Security Warning
                    </strong>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', margin: 0, lineHeight: 1.4 }}>
                        Do not upload classified, highly sensitive PII, or unauthorized proprietary data. ETH is an analytical assistance platform for educational and defensive threat modeling.
                    </p>
                </div>
            </div>

            {/* ── Bottom status + actions — reference: bg-background p-6 flex flex-wrap gap-3 items-center justify-between ── */}
            <div style={{
                background: '#000', padding: '24px',
                display: 'flex', flexWrap: 'wrap', gap: '12px',
                alignItems: 'center', justifyContent: 'space-between',
            }}>
                {/* Status — reference: font-mono text-[10px] text-muted-foreground uppercase tracking-widest */}
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    Ready: {portSummary} ports • {miscSummary} misconfigs • {logSummary}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    {!isEmpty && !loading && (
                        <button
                            type="button"
                            id="reset-btn"
                            onClick={onReset}
                            style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 400,
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                /* Reference: border border-white/20 px-5 py-3 hover:border-foreground transition-colors */
                                padding: '12px 20px',
                                background: 'transparent', color: '#888',
                                border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                                transition: 'border-color 0.15s, color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#888'; }}
                        >
                            Reset
                        </button>
                    )}

                    {/* Reference: bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-foreground hover:text-background disabled:opacity-30 disabled:cursor-not-allowed */}
                    <button
                        type="submit"
                        id="run-simulation-btn"
                        disabled={loading}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            padding: '12px 24px',
                            background: loading ? 'rgba(232,24,58,0.4)' : '#e8183a',
                            color: '#fff', border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.5 : 1,
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; } }}
                        onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#e8183a'; e.currentTarget.style.color = '#fff'; } }}
                    >
                        {loading ? (
                            <>
                                <span style={{
                                    display: 'inline-block', width: 12, height: 12,
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: '#fff', borderRadius: '50%',
                                    animation: 'spin 0.7s linear infinite',
                                }} />
                                Analyzing...
                            </>
                        ) : (
                            <><PlayIcon /> Run Simulation</>
                        )}
                    </button>
                </div>
            </div>

            {/* Validation error summary */}
            {Object.keys(fieldErrors).length > 0 && (
                <div style={{ padding: '10px 24px', background: 'rgba(255,0,51,0.06)', borderTop: '1px solid rgba(255,0,51,0.2)' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#ff0033', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                        <AlertIcon /> VALIDATION ERROR: Fix the highlighted fields above.
                    </p>
                </div>
            )}
        </form>
    );
}
