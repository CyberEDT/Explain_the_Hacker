/**
 * ThreatVisualization.jsx
 *
 * Lightweight SOC intelligence layer for ETH results.
 * This module stays inside the existing result layout and focuses on clarity:
 * evidence separation, dependency-aware attack paths, ATT&CK coverage, risk
 * dimensions, and remediation priority.
 */

import { useMemo } from 'react';
import {
    RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, Cell, LabelList,
    ComposedChart, Area, Scatter, CartesianGrid, ReferenceLine,
    PieChart, Pie, LineChart, Line,
} from 'recharts';
import ChartExplainer from '../../components/ChartExplainer';

function useThemeColors() {
    return useMemo(() => {
        const style = getComputedStyle(document.documentElement);
        const get = (v) => style.getPropertyValue(v).trim();
        return {
            accent: get('--color-accent'),
            success: get('--color-success'),
            warning: get('--color-warning'),
            danger: get('--color-danger'),
            info: get('--color-info'),
            purple: get('--color-purple') || '#cc44ff',
            surface: get('--color-surface'),
            surface2: get('--color-surface-2'),
            surface3: get('--color-surface-3'),
            border: get('--color-border'),
            textPrimary: get('--color-text-primary'),
            textSecondary: get('--color-text-secondary'),
            textMuted: get('--color-text-muted'),
            fontSans: get('--font-sans'),
            fontMono: get('--font-mono'),
        };
    }, []);
}

function clampScore(value, fallback = 0) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(0, Math.min(100, Math.round(n)));
}

function riskColor(score, colors) {
    if (score >= 80) return colors.danger;
    if (score >= 60) return colors.warning;
    if (score >= 40) return colors.info;
    return colors.success;
}

function evidenceMeta(type, colors) {
    const key = String(type || '').toLowerCase();
    if (key === 'observed' || key === 'verified') {
        return { label: 'VERIFIED', color: colors.success, bg: 'rgba(0,255,157,0.08)', border: 'rgba(0,255,157,0.25)' };
    }
    if (key === 'hypothetical') {
        return { label: 'POTENTIAL', color: colors.info, bg: 'rgba(0,170,255,0.07)', border: 'rgba(0,170,255,0.22)' };
    }
    return { label: 'INFERRED', color: colors.warning, bg: 'rgba(255,170,0,0.07)', border: 'rgba(255,170,0,0.22)' };
}

function EvidencePill({ type, colors }) {
    const meta = evidenceMeta(type, colors);
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 7px',
            background: meta.bg,
            border: `1px solid ${meta.border}`,
            color: meta.color,
            fontFamily: colors.fontMono,
            fontSize: '0.55rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
        }}>
            {meta.label}
        </span>
    );
}

function ChartCard({ title, subtitle, explanation, children, minHeight }) {
    return (
        <div className="card overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', minHeight }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
                    {title}
                </p>
                {subtitle && (
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#888', margin: '3px 0 0', lineHeight: 1.45 }}>
                        {subtitle}
                    </p>
                )}
            </div>
            <div style={{ padding: '16px', background: 'var(--color-surface)' }}>
                {explanation ? (
                    <ChartExplainer explanation={explanation}>
                        {children}
                    </ChartExplainer>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}

function buildPhaseData(result) {
    const riskLevelScore = { critical: 90, high: 72, medium: 52, low: 30 };
    return (result.attackChain || []).map((phase, index) => ({
        index: index + 1,
        phase: phase.phase,
        tactic: phase.tactic || phase.phase,
        mitreId: phase.mitreId,
        score: clampScore(phase.likelihoodScore, riskLevelScore[phase.riskLevel?.toLowerCase()] ?? 40),
        confidence: clampScore(phase.confidence || phase.confidenceScore, 45),
        evidenceType: phase.evidenceType || 'inferred',
        prerequisites: phase.prerequisites || [],
        generatedBecause: phase.generatedBecause || phase.supportingEvidence || [],
    }));
}

function buildEvidenceData(result, colors) {
    const counts = { observed: 0, inferred: 0, hypothetical: 0 };
    (result.attackChain || []).forEach((phase) => {
        const key = phase.evidenceType === 'observed' || phase.evidenceType === 'verified'
            ? 'observed'
            : phase.evidenceType === 'hypothetical'
                ? 'hypothetical'
                : 'inferred';
        counts[key] += 1;
    });
    return [
        { name: 'VERIFIED', value: counts.observed, fill: colors.success },
        { name: 'INFERRED', value: counts.inferred, fill: colors.warning },
        { name: 'POTENTIAL', value: counts.hypothetical, fill: colors.info },
    ].filter(d => d.value > 0);
}

function buildAttackCoverage(result) {
    const tactics = [
        'Reconnaissance',
        'Initial Access',
        'Execution',
        'Persistence',
        'Privilege Escalation',
        'Credential Access',
        'Discovery',
        'Lateral Movement',
        'Impact',
    ];
    const mappings = result.ATTACKMappings || [];
    return tactics.map((tactic) => {
        const mapped = mappings.filter(m => String(m.tactic || '').toLowerCase() === tactic.toLowerCase());
        const chainPhase = (result.attackChain || []).find(p => String(p.tactic || p.phase || '').toLowerCase() === tactic.toLowerCase());
        const confidence = mapped.length
            ? Math.round(mapped.reduce((sum, m) => sum + clampScore(m.confidence), 0) / mapped.length)
            : clampScore(chainPhase?.confidence || chainPhase?.confidenceScore, 0);
        return {
            tactic,
            count: mapped.length || (chainPhase ? chainPhase.techniques?.length || 1 : 0),
            confidence,
            evidenceType: chainPhase?.evidenceType || 'hypothetical',
        };
    });
}

function buildRemediationData(result) {
    const priorityScore = { critical: 95, high: 74, medium: 52, low: 28 };
    return (result.remediationPriority || result.mitigations || []).slice(0, 8).map((item, index) => ({
        name: item.title || item.id || `Action ${index + 1}`,
        priority: item.priority || 'medium',
        score: priorityScore[String(item.priority || 'medium').toLowerCase()] || 52,
    }));
}

function RiskGaugeChart({ score, colors }) {
    const metaColor = riskColor(score, colors);
    const data = [{ name: 'Risk', value: score, fill: metaColor }];

    return (
        <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart cx="50%" cy="60%" innerRadius="65%" outerRadius="95%" startAngle={180} endAngle={0} data={data} barSize={24}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: colors.surface2 }} dataKey="value" cornerRadius={10} isAnimationActive={false} />
                <Tooltip formatter={(v) => [`${v} / 100`, 'Exposure Risk']} itemStyle={{ color: '#fff' }} contentStyle={{
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 0,
                    fontFamily: colors.fontMono,
                    fontSize: 12,
                    color: colors.textPrimary,
                }} />
            </RadialBarChart>
        </ResponsiveContainer>
    );
}

function RiskGaugeSection({ result, colors }) {
    const score = clampScore(result.riskScore);
    const color = riskColor(score, colors);
    const level = score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
    return (
        <ChartCard
            title="Exposure Risk Gauge"
            subtitle="Overall score based on exposure, likelihood, complexity, business impact, blast radius, and internet accessibility."
            explanation="The Risk Gauge indicates the overall severity of the target's exposure. A score above 80 is CRITICAL, representing a highly exploitable attack surface. Scores between 60-79 are HIGH."
        >
            <div style={{ position: 'relative' }}>
                <RiskGaugeChart score={score} colors={colors} />
                <div style={{ position: 'absolute', inset: '0 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column', pointerEvents: 'none' }}>
                    <span style={{ fontFamily: colors.fontMono, fontSize: '2rem', color, fontWeight: 800, lineHeight: 1 }}>
                        {score}
                    </span>
                    <span style={{ fontFamily: colors.fontMono, fontSize: '0.62rem', color, border: `1px solid ${color}`, padding: '3px 8px', marginTop: 6 }}>
                        {level}
                    </span>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: colors.border, marginTop: 12 }}>
                <MetricBox label="Confidence" value={`${result.confidenceScore || 0}%`} color={colors.success} colors={colors} />
                <MetricBox label="ATT&CK Mapped" value={(result.ATTACKMappings || []).length} color={colors.info} colors={colors} />
            </div>
        </ChartCard>
    );
}

function MetricBox({ label, value, color, colors }) {
    return (
        <div style={{ background: '#000', padding: '12px 14px' }}>
            <p style={{ fontFamily: colors.fontMono, fontSize: '0.95rem', color, fontWeight: 800, margin: 0 }}>{value}</p>
            <p style={{ fontFamily: colors.fontMono, fontSize: '0.55rem', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</p>
        </div>
    );
}

function RiskDimensionHeatmap({ result, colors }) {
    const dimensions = result.riskAssessment?.dimensions?.length
        ? result.riskAssessment.dimensions
        : (result.riskBreakdown || []).map(d => ({ category: d.category, score: d.score, evidence: 'Derived from analysis result' }));

    return (
        <ChartCard
            title="Risk Heatmap"
            subtitle="Exposure dimensions ranked by severity so analysts can quickly see what drives the score."
            explanation="This heatmap breaks down the components that contribute to the overall risk score. It highlights whether the primary risk comes from Authentication weaknesses, Network Exposure, or Business Impact, allowing you to prioritize the root cause."
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 8 }}>
                {dimensions.slice(0, 9).map((d) => {
                    const score = clampScore(d.score);
                    const color = riskColor(score, colors);
                    return (
                        <div key={d.category} style={{ border: `1px solid ${colors.border}`, background: colors.surface2, padding: 12, minHeight: 94 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                                <span style={{ fontFamily: colors.fontMono, color, fontWeight: 800, fontSize: '0.9rem' }}>{score}</span>
                                <span style={{ width: 34, height: 4, background: color, display: 'inline-block' }} />
                            </div>
                            <p style={{ fontFamily: colors.fontSans, color: '#bbb', fontSize: '0.78rem', lineHeight: 1.35, marginTop: 8 }}>{d.category}</p>
                            <p style={{ fontFamily: colors.fontMono, color: colors.textMuted, fontSize: '0.55rem', lineHeight: 1.35, marginTop: 6 }}>{d.evidence}</p>
                        </div>
                    );
                })}
            </div>
        </ChartCard>
    );
}

function StageBarChart({ data, colors }) {
    return (
        <ResponsiveContainer width="100%" height={Math.max(data.length * 42 + 20, 180)}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 50, bottom: 0, left: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="phase" width={160} tick={{ fill: '#aaa', fontSize: 11, fontFamily: colors.fontSans }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: colors.surface2 }} formatter={(v, name) => [`${v}`, name === 'score' ? 'Likelihood' : 'Confidence']} contentStyle={{
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 0,
                    fontFamily: colors.fontMono,
                    fontSize: 12,
                    color: colors.textPrimary,
                }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                    {data.map((entry) => <Cell key={entry.phase} fill={riskColor(entry.score, colors)} />)}
                    <LabelList dataKey="score" position="right" style={{ fill: '#ccc', fontSize: 11, fontFamily: colors.fontMono, fontWeight: 700 }} formatter={(v) => `${v}`} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

function AttackProbabilitySection({ phaseData, colors }) {
    return (
        <ChartCard
            title="Attack Likelihood by Phase"
            subtitle="Dependency-aware phase likelihood; high scores indicate feasible attack transitions, not confirmed compromise."
            explanation="This chart visualizes the probability of an attacker successfully completing each phase of the attack lifecycle. A high likelihood in the 'Install' or 'C2' phases suggests that early-stage controls (like Recon and Deliver) are failing."
        >
            <StageBarChart data={phaseData} colors={colors} />
        </ChartCard>
    );
}

function AttackFlowChart({ data, colors }) {
    return (
        <ResponsiveContainer width="100%" height={230}>
            <ComposedChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -20 }}>
                <defs>
                    <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.info} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={colors.info} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
                <XAxis dataKey="phase" tick={{ fill: '#999', fontSize: 10, fontFamily: colors.fontSans }} axisLine={false} tickLine={false} interval={0} height={38} tickFormatter={(v) => v.length > 10 ? `${v.slice(0, 10)}...` : v} />
                <YAxis domain={[0, 100]} tick={{ fill: '#999', fontSize: 10, fontFamily: colors.fontMono }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 0,
                    fontFamily: colors.fontMono,
                    fontSize: 12,
                    color: colors.textPrimary,
                }} formatter={(v, name) => [`${v}`, name === 'score' ? 'Likelihood' : 'Confidence']} />
                <ReferenceLine y={80} stroke={colors.danger} strokeDasharray="5 3" strokeOpacity={0.75} label={{ value: 'Critical', fill: colors.danger, fontSize: 10, fontFamily: colors.fontSans, position: 'insideTopRight', fontWeight: 700 }} />
                <Area type="monotone" dataKey="score" stroke={colors.info} strokeWidth={2.5} fill="url(#flowGradient)" dot={{ r: 4, fill: colors.info, stroke: '#fff', strokeWidth: 1 }} isAnimationActive={false} />
                <Line type="monotone" dataKey="confidence" stroke={colors.success} strokeWidth={1.5} dot={{ r: 3, fill: colors.success }} isAnimationActive={false} />
                <Scatter dataKey="score" fill={colors.info} shape={(props) => {
                    if (props.score < 80) return null;
                    return <circle cx={props.cx} cy={props.cy} r={6} fill={colors.danger} stroke="#fff" strokeWidth={2} />;
                }} />
            </ComposedChart>
        </ResponsiveContainer>
    );
}

function AttackFlowSection({ phaseData, colors }) {
    return (
        <ChartCard
            title="Kill-Chain Timeline"
            subtitle="Likelihood and confidence move separately so analysts can distinguish feasible paths from evidence strength."
            explanation="The blue area shows how likely the attack is to progress across phases. The green line shows how confident the system is in this assessment based on the provided logs and evidence. A gap between the two means high theoretical risk but low observed evidence."
        >
            <AttackFlowChart data={phaseData} colors={colors} />
        </ChartCard>
    );
}

function EvidenceDistribution({ evidenceData, colors }) {
    const total = evidenceData.reduce((sum, d) => sum + d.value, 0);
    return (
        <ChartCard
            title="Evidence Distribution"
            subtitle="Separates verified, inferred, and potential intelligence across the generated attack path."
            explanation="This pie chart categorizes the evidence. VERIFIED means the activity was explicitly found in logs. INFERRED means it's highly likely based on related activity. POTENTIAL means the attacker could theoretically perform this action based on current misconfigurations."
        >
            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-4 items-center">
                <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                        <Pie data={evidenceData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={66} paddingAngle={3} isAnimationActive={false}>
                            {evidenceData.map(d => <Cell key={d.name} fill={d.fill} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 0, fontFamily: colors.fontMono, fontSize: 12, color: colors.textPrimary }} />
                    </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {evidenceData.map(d => (
                        <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontFamily: colors.fontMono, fontSize: '0.58rem', color: d.fill, fontWeight: 800 }}>{d.name}</span>
                            <span style={{ height: 5, background: colors.surface2, display: 'block' }}>
                                <span style={{ width: `${total ? (d.value / total) * 100 : 0}%`, height: '100%', display: 'block', background: d.fill }} />
                            </span>
                            <span style={{ fontFamily: colors.fontMono, fontSize: '0.65rem', color: '#aaa' }}>{d.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </ChartCard>
    );
}

function ConfidenceDistribution({ phaseData, colors }) {
    const buckets = [
        { name: 'Low', value: phaseData.filter(p => p.confidence < 45).length, fill: colors.info },
        { name: 'Medium', value: phaseData.filter(p => p.confidence >= 45 && p.confidence < 75).length, fill: colors.warning },
        { name: 'High', value: phaseData.filter(p => p.confidence >= 75).length, fill: colors.success },
    ];
    return (
        <ChartCard
            title="Confidence Distribution"
            subtitle="Shows how much of the modeled path is backed by strong evidence versus lower-confidence inference."
            explanation="This shows the system's certainty in its analysis. If most items are 'High', the threat intelligence mapping is strongly supported by the provided data. If most are 'Low', the system is extrapolating potential risks from limited inputs."
        >
            <ResponsiveContainer width="100%" height={175}>
                <BarChart data={buckets} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <XAxis dataKey="name" tick={{ fill: '#999', fontSize: 10, fontFamily: colors.fontMono }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#999', fontSize: 10, fontFamily: colors.fontMono }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 0, fontFamily: colors.fontMono, fontSize: 12, color: colors.textPrimary }} />
                    <Bar dataKey="value" isAnimationActive={false}>
                        {buckets.map(d => <Cell key={d.name} fill={d.fill} />)}
                        <LabelList dataKey="value" position="top" style={{ fill: '#ccc', fontSize: 11, fontFamily: colors.fontMono, fontWeight: 700 }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

function AttackGraph({ result, phaseData, colors }) {
    const maxNodes = 8;
    const services = (result.affectedAssets || []).slice(0, 3);
    const phases = phaseData.slice(0, maxNodes);
    const nodeColor = (node) => node.kind === 'service'
        ? colors.info
        : node.kind === 'control'
            ? colors.warning
            : riskColor(node.score, colors);

    const nodes = [
        { id: 'internet', label: 'Internet', kind: 'source', x: 8, y: 50, score: 60 },
        ...services.map((label, i) => ({ id: `svc-${i}`, label, kind: 'service', x: 26, y: 26 + i * 24, score: 62 })),
        ...phases.map((phase, i) => ({
            id: `phase-${i}`,
            label: phase.phase,
            kind: i < 2 ? 'control' : 'phase',
            x: 50 + (i % 3) * 17,
            y: 22 + Math.floor(i / 3) * 28,
            score: phase.score,
            evidenceType: phase.evidenceType,
        })),
    ];
    const serviceTargets = services.length ? services.map((_, i) => `svc-${i}`) : ['phase-0'];
    const edges = [
        ...serviceTargets.map(target => ({ from: 'internet', to: target, score: 68, label: 'exposure' })),
        ...services.map((_, i) => ({ from: `svc-${i}`, to: 'phase-1', score: phases[1]?.score || 50, label: 'access' })),
        ...phases.slice(1).map((phase, i) => ({ from: `phase-${i}`, to: `phase-${i + 1}`, score: phase.score, label: phase.evidenceType })),
    ];
    const byId = Object.fromEntries(nodes.map(n => [n.id, n]));

    return (
        <ChartCard
            title="Attack Graph"
            subtitle="Nodes show exposed services and attack phases; edge color/weight indicates path feasibility."
            explanation="This graph maps the structural path an attacker would take. It starts at the Internet (source), moves through vulnerable services, and connects to subsequent attack phases. Thicker, red lines indicate highly probable and dangerous attack paths."
        >
            <div style={{ overflowX: 'auto' }}>
                <svg viewBox="0 0 105 95" role="img" aria-label="Attack graph" style={{ width: '100%', minWidth: 620, height: 420, display: 'block' }}>
                    <defs>
                        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                            <path d="M0,0 L8,4 L0,8 Z" fill={colors.textMuted} />
                        </marker>
                    </defs>
                    {edges.map((edge, index) => {
                        const from = byId[edge.from];
                        const to = byId[edge.to];
                        if (!from || !to) return null;
                        const color = riskColor(edge.score, colors);
                        return (
                            <g key={`${edge.from}-${edge.to}-${index}`}>
                                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={Math.max(0.5, edge.score / 45)} strokeOpacity="0.72" markerEnd="url(#arrow)" />
                                <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 1.5} fill={colors.textMuted} fontFamily={colors.fontMono} fontSize="1.8" textAnchor="middle">
                                    {edge.score}
                                </text>
                            </g>
                        );
                    })}
                    {nodes.map((node) => {
                        const color = nodeColor(node);
                        return (
                            <g key={node.id}>
                                <rect x={node.x - 6} y={node.y - 4} width="12" height="8" rx="0.8" fill="#050505" stroke={color} strokeWidth="0.7" />
                                <circle cx={node.x - 4.8} cy={node.y - 2.8} r="0.7" fill={color} />
                                <text x={node.x} y={node.y + 0.5} fill="#ddd" fontFamily={colors.fontSans} fontSize="2.1" textAnchor="middle">
                                    {node.label.length > 14 ? `${node.label.slice(0, 14)}...` : node.label}
                                </text>
                                {node.evidenceType && (
                                    <text x={node.x} y={node.y + 6.3} fill={evidenceMeta(node.evidenceType, colors).color} fontFamily={colors.fontMono} fontSize="1.6" textAnchor="middle">
                                        {evidenceMeta(node.evidenceType, colors).label}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </ChartCard>
    );
}

function AttackCoverageMatrix({ coverage, colors }) {
    return (
        <ChartCard
            title="MITRE ATT&CK Coverage"
            subtitle="Tactics are highlighted only where the engine generated evidence-backed mappings."
            explanation="This matrix highlights which MITRE ATT&CK tactics the current threat covers. Active squares indicate that techniques belonging to that tactic were either observed in logs or are possible due to the target's exposed misconfigurations."
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 8 }}>
                {coverage.map((item) => {
                    const active = item.count > 0;
                    const meta = evidenceMeta(item.evidenceType, colors);
                    return (
                        <div key={item.tactic} style={{ border: `1px solid ${active ? meta.border : colors.border}`, background: active ? meta.bg : '#050505', padding: 12, minHeight: 92 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                <span style={{ fontFamily: colors.fontMono, color: active ? meta.color : colors.textMuted, fontSize: '0.58rem', fontWeight: 800 }}>{active ? meta.label : 'NO MAP'}</span>
                                <span style={{ fontFamily: colors.fontMono, color: active ? '#bbb' : colors.textMuted, fontSize: '0.62rem' }}>{item.count}</span>
                            </div>
                            <p style={{ fontFamily: colors.fontSans, color: '#ddd', fontSize: '0.82rem', marginTop: 10, lineHeight: 1.3 }}>{item.tactic}</p>
                            <div style={{ marginTop: 10, height: 4, background: colors.surface2 }}>
                                <span style={{ display: 'block', height: '100%', width: `${item.confidence}%`, background: active ? meta.color : colors.textMuted }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </ChartCard>
    );
}

function ExposureTopology({ result, colors }) {
    const assets = result.affectedAssets || [];
    const dimensions = result.riskAssessment?.dimensions || [];
    const blast = dimensions.find(d => String(d.category).toLowerCase().includes('blast'))?.score ?? result.riskScore;
    const segmentation = dimensions.find(d => String(d.category).toLowerCase().includes('segmentation'))?.score ?? 40;
    return (
        <ChartCard
            title="Exposure Topology"
            subtitle="Summarizes where exposure starts, how blast radius grows, and where segmentation should be reviewed."
            explanation="This section highlights structural vulnerabilities in your network. Blast Radius indicates how far an attacker could spread after initial compromise. Segmentation Weakness highlights the lack of internal barriers between services."
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TopologyMetric label="Blast Radius" score={blast} colors={colors} />
                <TopologyMetric label="Segmentation Weakness" score={segmentation} colors={colors} />
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {assets.length ? assets.map(asset => (
                    <span key={asset} style={{ border: `1px solid ${colors.border}`, background: '#050505', color: '#aaa', padding: '5px 8px', fontFamily: colors.fontMono, fontSize: '0.6rem' }}>
                        {asset}
                    </span>
                )) : (
                    <span style={{ color: colors.textMuted, fontFamily: colors.fontMono, fontSize: '0.62rem' }}>No affected assets reported</span>
                )}
            </div>
        </ChartCard>
    );
}

function TopologyMetric({ label, score, colors }) {
    const value = clampScore(score);
    const color = riskColor(value, colors);
    return (
        <div style={{ background: '#050505', border: `1px solid ${colors.border}`, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: colors.fontMono, color: colors.textMuted, fontSize: '0.58rem', textTransform: 'uppercase' }}>{label}</span>
                <span style={{ fontFamily: colors.fontMono, color, fontWeight: 800 }}>{value}</span>
            </div>
            <div style={{ height: 5, background: colors.surface2, marginTop: 10 }}>
                <span style={{ display: 'block', height: '100%', width: `${value}%`, background: color }} />
            </div>
        </div>
    );
}

function RemediationPriorityChart({ data, colors }) {
    return (
        <ChartCard
            title="Remediation Priority"
            subtitle="Prioritized controls based on urgency, exposure reduction value, and remediation sequence."
            explanation="This chart ranks actionable fixes. The longer the bar, the more critical the remediation is for reducing overall risk. Fix the items at the top first to eliminate the most significant exposure points."
        >
            <ResponsiveContainer width="100%" height={Math.max(data.length * 38 + 20, 170)}>
                <BarChart data={data} layout="vertical" margin={{ top: 0, right: 44, bottom: 0, left: 0 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" width={190} tick={{ fill: '#aaa', fontSize: 10, fontFamily: colors.fontSans }} axisLine={false} tickLine={false} tickFormatter={(v) => v.length > 24 ? `${v.slice(0, 24)}...` : v} />
                    <Tooltip formatter={(v) => [`${v}`, 'Priority']} contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 0, fontFamily: colors.fontMono, fontSize: 12, color: colors.textPrimary }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                        {data.map(d => <Cell key={d.name} fill={riskColor(d.score, colors)} />)}
                        <LabelList dataKey="priority" position="right" style={{ fill: '#ccc', fontSize: 10, fontFamily: colors.fontMono, fontWeight: 700 }} formatter={(v) => String(v).toUpperCase()} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

function ExplainabilityPanel({ phaseData, colors }) {
    const topPhase = [...phaseData].sort((a, b) => b.score - a.score)[0];
    if (!topPhase) return null;
    return (
        <ChartCard
            title="Analyst Explainability"
            subtitle="Plain-language reasoning for the highest-likelihood attack path element."
        >
            <div style={{ borderLeft: `2px solid ${riskColor(topPhase.score, colors)}`, paddingLeft: 14 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    <p style={{ fontFamily: colors.fontSans, color: '#fff', fontWeight: 700, margin: 0 }}>{topPhase.phase}</p>
                    <EvidencePill type={topPhase.evidenceType} colors={colors} />
                    <span style={{ fontFamily: colors.fontMono, color: colors.textMuted, fontSize: '0.6rem' }}>Likelihood {topPhase.score} / Confidence {topPhase.confidence}</span>
                </div>
                <InfoBlock label="Why this exists" items={topPhase.generatedBecause} colors={colors} />
                <InfoBlock label="Prerequisites" items={topPhase.prerequisites} colors={colors} />
                <p style={{ fontFamily: colors.fontSans, color: '#888', fontSize: '0.82rem', lineHeight: 1.55, marginTop: 12 }}>
                    This view models exposure-driven feasibility. It helps prioritize investigation and remediation without claiming that compromise succeeded.
                </p>
            </div>
        </ChartCard>
    );
}

function InfoBlock({ label, items = [], colors }) {
    return (
        <div style={{ marginTop: 12 }}>
            <p style={{ fontFamily: colors.fontMono, color: colors.textMuted, fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{label}</p>
            {items.length ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {items.slice(0, 3).map((item, index) => (
                        <li key={`${item}-${index}`} style={{ fontFamily: colors.fontSans, color: '#aaa', fontSize: '0.78rem', lineHeight: 1.45 }}>
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <span style={{ fontFamily: colors.fontMono, color: colors.textMuted, fontSize: '0.6rem' }}>Not enough telemetry to state a stronger prerequisite.</span>
            )}
        </div>
    );
}

export default function ThreatVisualization({ result }) {
    const colors = useThemeColors();
    const phaseData = useMemo(() => buildPhaseData(result), [result]);
    const evidenceData = useMemo(() => buildEvidenceData(result, colors), [result, colors]);
    const coverage = useMemo(() => buildAttackCoverage(result), [result]);
    const remediations = useMemo(() => buildRemediationData(result), [result]);

    if (!result) return null;

    return (
        <div className="space-y-4 animate-fade-in-up" aria-label="Threat Visualization Charts" style={{ marginTop: 28 }}>
            <div className="flex items-center gap-3 px-1">
                <div className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider px-3" style={{ color: 'var(--color-text-muted)' }}>
                    Intelligence Visualization
                </span>
                <div className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <RiskGaugeSection result={result} colors={colors} />
                <div className="lg:col-span-2">
                    <RiskDimensionHeatmap result={result} colors={colors} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AttackProbabilitySection phaseData={phaseData} colors={colors} />
                <AttackFlowSection phaseData={phaseData} colors={colors} />
            </div>

            <AttackGraph result={result} phaseData={phaseData} colors={colors} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <EvidenceDistribution evidenceData={evidenceData} colors={colors} />
                <ConfidenceDistribution phaseData={phaseData} colors={colors} />
                <ExposureTopology result={result} colors={colors} />
            </div>

            <AttackCoverageMatrix coverage={coverage} colors={colors} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RemediationPriorityChart data={remediations} colors={colors} />
                <ExplainabilityPanel phaseData={phaseData} colors={colors} />
            </div>
        </div>
    );
}
