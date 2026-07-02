/**
 * useExplainHacker.js — Custom Hook: Encapsulates ALL business logic for the tool.
 *
 * ┌─ Responsibilities ─────────────────────────────────────────────────────────┐
 * │  1. Form state   — openPorts, misconfigurations, logSnippet               │
 * │  2. Lifecycle    — loading / result / error (single source of truth)      │
 * │  3. Validation   — Zod before submission                                  │
 * │  4. API call     — AbortController for cancellation                       │
 * │  5. Normalization— reshape raw API response into a stable contract        │
 * │  6. Sanitization — strip HTML/scripts from every AI-generated text field  │
 * │  7. Errors       — network failures, timeouts, API codes all unified here │
 * │  8. History      — last 5 analyses, in-memory                             │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * Components are kept purely presentational — they receive data and callbacks
 * from this hook and never deal with API mechanics or sanitization directly.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
    attackSimulationSchema,
    defaultFormValues,
    stripHtml,
    stripScripts,
} from './validationSchema';
import { analyzeAttackChain } from '@/services/analysisAPI';

// ─── localStorage Utilities ─────────────────────────────────────────────────────
const HISTORY_STORAGE_KEY = 'cyberedt_explainhacker_history';
const SECRET_KEY = 'cyberedt-secure-key-2026';

function encryptData(dataStr) {
    const text = encodeURIComponent(dataStr);
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    return btoa(result);
}

function decryptData(base64Str) {
    try {
        const text = atob(base64Str);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
        }
        return decodeURIComponent(result);
    } catch {
        return null;
    }
}

/** Save history to localStorage */
const saveHistoryToStorage = (history) => {
    try {
        if (localStorage.getItem('cyberedt_consent') === 'accepted') {
            const encrypted = encryptData(JSON.stringify(history));
            localStorage.setItem(HISTORY_STORAGE_KEY, encrypted);
        } else {
            localStorage.removeItem(HISTORY_STORAGE_KEY);
        }
    } catch (error) {
        console.warn('Failed to save history to localStorage:', error);
    }
};

/** Load history from localStorage */
const loadHistoryFromStorage = () => {
    try {
        if (localStorage.getItem('cyberedt_consent') === 'accepted') {
            const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (!stored) return [];
            const decrypted = decryptData(stored);
            return decrypted ? JSON.parse(decrypted) : [];
        }
        return [];
    } catch (error) {
        console.warn('Failed to load history from localStorage:', error);
        return [];
    }
};

// ─── AI Output Sanitization ───────────────────────────────────────────────────
// AI models can occasionally output markdown, HTML tags, or script fragments.
// Every string field from the AI response is run through sanitizeText before
// being stored in state and passed to components.

/**
 * Sanitize a single AI-generated text field.
 * - Strips HTML tags
 * - Strips script blocks and JS event attributes
 * - Trims whitespace
 * - Falls back to `fallback` if the result is empty
 *
 * @param {unknown} value
 * @param {string} [fallback='']
 * @returns {string}
 */
function sanitizeText(value, fallback = '') {
    if (typeof value !== 'string') return fallback;
    const cleaned = stripScripts(stripHtml(value)).trim();
    return cleaned || fallback;
}

/**
 * Sanitize a number, clamping it to [min, max].
 * Returns `fallback` if the value is not a finite number.
 */
function sanitizeNumber(value, { min = 0, max = 100, fallback = 0 } = {}) {
    const n = Number(value);
    if (!isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, Math.round(n)));
}

function sanitizeJson(value) {
    if (typeof value === 'string') return sanitizeText(value, '');
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'boolean' || value == null) return value;
    if (Array.isArray(value)) return value.map(sanitizeJson);
    if (typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [sanitizeText(k, ''), sanitizeJson(v)]));
    }
    return null;
}

/** Sanitize a risk level string to one of the known values. */
const KNOWN_RISK_LEVELS = ['low', 'medium', 'high', 'critical'];
function sanitizeRiskLevel(value) {
    const s = String(value || '').toLowerCase().trim();
    return KNOWN_RISK_LEVELS.includes(s) ? s : 'medium';
}

/** Sanitize severity string. */
const KNOWN_SEVERITIES = ['low', 'medium', 'high', 'critical'];
function sanitizeSeverity(value) {
    const s = String(value || '').toLowerCase().trim();
    return KNOWN_SEVERITIES.includes(s) ? s : 'medium';
}

/** Sanitize mitigation priority string. */
const KNOWN_PRIORITIES = ['low', 'medium', 'high', 'critical'];
function sanitizePriority(value) {
    const s = String(value || '').toLowerCase().trim();
    return KNOWN_PRIORITIES.includes(s) ? s : 'medium';
}

// ─── Response Normalizer ──────────────────────────────────────────────────────
// Converts any raw API response (real or mock) into a stable, typed contract
// that UI components can rely on — even if the AI returns partial/malformed data.

/**
 * Normalize and sanitize the raw API response into an AnalysisResult object.
 * Any missing or invalid fields are replaced with safe defaults.
 * This function guarantees UI stability (preventing undefined crashes in ResultsPanel)
 * even during high-intensity chaos scans or malformed engine outputs.
 *
 * @param {unknown} raw  Raw response from analyzeAttackChain()
 * @returns {AnalysisResult}  Normalized, sanitized result ready for the UI layer
 */
function normalizeResult(raw) {
    if (!raw || typeof raw !== 'object') {
        throw new Error('Invalid response format received from the analysis engine.');
    }

    // ── Top-level fields ──────────────────────────────────────────────────────
    const id = sanitizeText(raw.id, `fallback-${Date.now()}`);
    const timestamp = raw.timestamp && !isNaN(Date.parse(raw.timestamp))
        ? raw.timestamp
        : new Date().toISOString();
    const riskScore = sanitizeNumber(raw.riskScore, { min: 0, max: 100, fallback: 0 });
    const confidenceScore = sanitizeNumber(raw.confidenceScore, { min: 0, max: 100, fallback: 0 });
    
    // Bypass sanitizeText for summary to preserve all engine-generated newlines.
    // React inherently escapes text nodes, so this is safe from XSS.
    const summary = typeof raw.summary === 'string' ? raw.summary.trim() : 'No summary returned by the analysis engine.';

    // ── Attack Chain ──────────────────────────────────────────────────────────
    const sanitizeChain = (chain) => Array.isArray(chain)
        ? chain.map((phase, i) => ({
            phase:             sanitizeText(phase?.phase, `Phase ${i + 1}`),
            status:            sanitizeText(phase?.status, 'NOT OBSERVED'),
            explanation:       sanitizeText(phase?.explanation, ''),
            confidence:        sanitizeNumber(phase?.confidence, { min: 0, max: 100, fallback: 0 }),
            evidenceType:      ['observed', 'inferred', 'hypothetical', 'none'].includes(phase?.evidenceType)
                                ? phase.evidenceType : 'none',
            supportingEvidence: Array.isArray(phase?.supportingEvidence)
                                ? phase.supportingEvidence.map(s => sanitizeText(s, '')).filter(Boolean)
                                : [],
            techniques: Array.isArray(phase?.techniques)
                ? phase.techniques.map((t) => ({
                    id:               sanitizeText(t?.id, ''),
                    name:             sanitizeText(t?.name, 'Unknown Technique'),
                    tactic:           sanitizeText(t?.tactic, ''),
                    description:      sanitizeText(t?.description, ''),
                    confidence:       sanitizeNumber(t?.confidence, { min: 0, max: 100, fallback: 0 }),
                    evidenceType:     ['observed', 'inferred', 'hypothetical'].includes(t?.evidenceType)
                                        ? t.evidenceType : 'inferred',
                    generatedBecause: Array.isArray(t?.generatedBecause)
                                        ? t.generatedBecause.map(s => sanitizeText(s, '')).filter(Boolean)
                                        : [],
                }))
                : [],
        }))
        : [];

    const killChain = sanitizeChain(raw.killChain);


    // ── IOC List ──────────────────────────────────────────────────────────────
    const iocList = Array.isArray(raw.iocList)
        ? raw.iocList.map((ioc) => ({
            type:          sanitizeText(ioc?.type, 'Unknown'),
            value:         sanitizeText(ioc?.value, ''),
            label:         sanitizeText(ioc?.label, ''),
            severity:      sanitizeSeverity(ioc?.severity),
            evidenceType:  ['observed', 'inferred', 'hypothetical'].includes(ioc?.evidenceType)
                            ? ioc.evidenceType : 'observed',
            verified:      Boolean(ioc?.verified),
            reputationScore: sanitizeNumber(ioc?.reputationScore, { min: 0, max: 100, fallback: 0 }),
            anomalyScore:    sanitizeNumber(ioc?.anomalyScore, { min: 0, max: 100, fallback: 0 }),
            confidence:      sanitizeNumber(ioc?.confidence, { min: 0, max: 100, fallback: 0 }),
            falsePositiveNotes: sanitizeText(ioc?.falsePositiveNotes, ''),
        })).filter((ioc) => ioc.value !== '')
        : [];


    // ── Mitigations ───────────────────────────────────────────────────────────
    const mitigations = Array.isArray(raw.mitigations)
        ? raw.mitigations.map((m) => ({
            id: sanitizeText(m?.id, ''),
            title: sanitizeText(m?.title, 'Mitigation'),
            priority: sanitizePriority(m?.priority),
            description: sanitizeText(m?.description, ''),
        }))
        : [];

    // ── Risk Breakdown ────────────────────────────────────────────────────────
    const riskBreakdown = Array.isArray(raw.riskBreakdown)
        ? raw.riskBreakdown.map((rb) => ({
            category: sanitizeText(rb?.category, 'Unknown'),
            score: sanitizeNumber(rb?.score, { min: 0, max: 100, fallback: 0 }),
        })).filter((rb) => rb.category !== 'Unknown')
        : [];

    // ── Misc scalar fields ────────────────────────────────────────────────────
    const detectionDifficulty = sanitizeText(raw.detectionDifficulty, 'Unknown');
    const estimatedDwellTime = sanitizeText(raw.estimatedDwellTime, 'Unknown');
    const affectedAssets = Array.isArray(raw.affectedAssets)
        ? raw.affectedAssets.map((a) => sanitizeText(a, '')).filter(Boolean)
        : [];

    // ── Evidence summary + confidence metrics (new fields) ────────────────────
    const evidenceSummary = raw.evidenceSummary && typeof raw.evidenceSummary === 'object' ? {
        observedFindings: Array.isArray(raw.evidenceSummary.observedFindings)
            ? raw.evidenceSummary.observedFindings.map(s => sanitizeText(s, '')).filter(Boolean)
            : [],
        inferredRisks: Array.isArray(raw.evidenceSummary.inferredRisks)
            ? raw.evidenceSummary.inferredRisks.map(s => sanitizeText(s, '')).filter(Boolean)
            : [],
        hypotheticalScenarios: Array.isArray(raw.evidenceSummary.hypotheticalScenarios)
            ? raw.evidenceSummary.hypotheticalScenarios.map(s => sanitizeText(s, '')).filter(Boolean)
            : [],
    } : { observedFindings: [], inferredRisks: [], hypotheticalScenarios: [] };

    const confidenceMetrics = raw.confidenceMetrics && typeof raw.confidenceMetrics === 'object' ? {
        overallConfidence: sanitizeNumber(raw.confidenceMetrics.overallConfidence, { min: 0, max: 100, fallback: 0 }),
        dataSources: Array.isArray(raw.confidenceMetrics.dataSources)
            ? raw.confidenceMetrics.dataSources.map(s => sanitizeText(s, '')).filter(Boolean)
            : [],
    } : { overallConfidence: 0, dataSources: [] };

    const verifiedFindings = Array.isArray(raw.verifiedFindings) ? sanitizeJson(raw.verifiedFindings) : [];
    const inferredRisks = Array.isArray(raw.inferredRisks) ? sanitizeJson(raw.inferredRisks) : [];
    const hypotheticalScenarios = Array.isArray(raw.hypotheticalScenarios) ? sanitizeJson(raw.hypotheticalScenarios) : [];

    const defaultAccuracy = {
        serviceAccuracy: 50,
        mitreAccuracy: 50,
        exploitValidation: 30,
        attackChainConsistency: 50,
        falsePositiveResistance: 50,
        overallAccuracy: 50
    };
    
    const accuracyAssessment = raw.accuracyAssessment && typeof raw.accuracyAssessment === 'object' 
        ? {
            serviceAccuracy: sanitizeNumber(raw.accuracyAssessment.serviceAccuracy, {min: 0, max: 100, fallback: 50}),
            mitreAccuracy: sanitizeNumber(raw.accuracyAssessment.mitreAccuracy, {min: 0, max: 100, fallback: 50}),
            exploitValidation: sanitizeNumber(raw.accuracyAssessment.exploitValidation, {min: 0, max: 100, fallback: 30}),
            attackChainConsistency: sanitizeNumber(raw.accuracyAssessment.attackChainConsistency, {min: 0, max: 100, fallback: 50}),
            falsePositiveResistance: sanitizeNumber(raw.accuracyAssessment.falsePositiveResistance, {min: 0, max: 100, fallback: 50}),
            overallAccuracy: sanitizeNumber(raw.accuracyAssessment.overallAccuracy, {min: 0, max: 100, fallback: 50})
        }
        : defaultAccuracy;

    const attackPaths = Array.isArray(raw.attackPaths) ? sanitizeJson(raw.attackPaths) : killChain;
    const ATTACKMappings = Array.isArray(raw.ATTACKMappings) ? sanitizeJson(raw.ATTACKMappings) : [];
    const riskAssessment = raw.riskAssessment && typeof raw.riskAssessment === 'object' ? sanitizeJson(raw.riskAssessment) : {};
    const remediationPriority = Array.isArray(raw.remediationPriority) ? sanitizeJson(raw.remediationPriority) : mitigations;

    // ── UNKNOWN PORT HANDLING FRAMEWORK — Normalize framework output ──────────
    const frameworkWarnings = Array.isArray(raw.frameworkWarnings)
        ? raw.frameworkWarnings.map(w => sanitizeText(w, '')).filter(Boolean)
        : [];

    const rawPIS = raw.portIntelStatus;
    const portIntelStatus = rawPIS && typeof rawPIS === 'object' ? {
        knownPorts:          Array.isArray(rawPIS.knownPorts) ? rawPIS.knownPorts.map(p => sanitizeText(p, '')).filter(Boolean) : [],
        unknownPorts:        Array.isArray(rawPIS.unknownPorts) ? rawPIS.unknownPorts.map(p => sanitizeText(p, '')).filter(Boolean) : [],
        unmatchedMisconfigs: Array.isArray(rawPIS.unmatchedMisconfigs) ? rawPIS.unmatchedMisconfigs.map(s => sanitizeText(s, '')).filter(Boolean) : [],
        allPortsUnknown:     Boolean(rawPIS.allPortsUnknown),
        hasUnknownEntities:  Boolean(rawPIS.hasUnknownEntities),
    } : { knownPorts: [], unknownPorts: [], unmatchedMisconfigs: [], allPortsUnknown: false, hasUnknownEntities: false };

    const serviceIntelligence = Array.isArray(raw.serviceIntelligence) ? sanitizeJson(raw.serviceIntelligence) : [];

    return {
        id,
        timestamp,
        riskScore,
        confidenceScore,
        intelligenceLevel: raw.intelligenceLevel || 'LOW',
        accuracyAssessment,
        summary,
        killChain,
        iocList,
        mitigations,
        riskBreakdown,
        detectionDifficulty,
        estimatedDwellTime,
        affectedAssets,
        evidenceSummary,
        confidenceMetrics,
        verifiedFindings,
        inferredRisks,
        hypotheticalScenarios,
        ATTACKMappings,
        riskAssessment,
        remediationPriority,
        frameworkWarnings,
        portIntelStatus,
        serviceIntelligence,
    };

}

// ─── useExplainHacker ─────────────────────────────────────────────────────────

export default function useExplainHacker() {

    // ── Lifecycle state ────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);      // string | null
    const [result, setResult] = useState(null);      // AnalysisResult | null

    // ── Form state ─────────────────────────────────────────────────────────────
    const [formValues, setFormValues] = useState({ ...defaultFormValues });

    // ── Per-field validation errors ────────────────────────────────────────────
    const [fieldErrors, setFieldErrors] = useState({});

    // ── History (last 5, persisted in localStorage) ───────────────────────────────
    const [history, setHistory] = useState(() => loadHistoryFromStorage());

    // ── In-flight abort controller ─────────────────────────────────────────────
    const abortRef = useRef(null);

    // ── Auto-save history to localStorage ─────────────────────────────────────
    useEffect(() => {
        saveHistoryToStorage(history);

        // Also save history immediately when consent changes
        const handleConsentChanged = () => {
            saveHistoryToStorage(history);
        };
        window.addEventListener('storage-consent-changed', handleConsentChanged);
        return () => window.removeEventListener('storage-consent-changed', handleConsentChanged);
    }, [history]);

    // ──────────────────────────────────────────────────────────────────────────
    // PORT ACTIONS
    // ──────────────────────────────────────────────────────────────────────────

    const addPort = useCallback((raw) => {
        const value = raw.trim().replace(/[^0-9]/g, '');
        if (!value) return 'Enter a port number.';
        const n = Number(value);
        if (!Number.isInteger(n) || n < 1 || n > 65535) {
            return 'Port must be between 1 and 65535.';
        }
        const str = String(n);
        setFormValues((prev) => {
            if (prev.openPorts.includes(str)) return prev;
            if (prev.openPorts.length >= 50) return prev;
            return { ...prev, openPorts: [...prev.openPorts, str] };
        });
        setFieldErrors((prev) => { const n = { ...prev }; delete n.openPorts; return n; });
        return null;
    }, []);

    const addPorts = useCallback((ports) => {
        setFormValues((prev) => ({
            ...prev,
            openPorts: [...new Set([...prev.openPorts, ...ports])].slice(0, 50),
        }));
        setFieldErrors((prev) => { const n = { ...prev }; delete n.openPorts; return n; });
    }, []);

    const removePort = useCallback((port) => {
        setFormValues((prev) => ({
            ...prev,
            openPorts: prev.openPorts.filter((p) => p !== port),
        }));
    }, []);

    // ──────────────────────────────────────────────────────────────────────────
    // MISCONFIGURATION ACTIONS
    // ──────────────────────────────────────────────────────────────────────────

    const addMisconfiguration = useCallback((raw) => {
        const value = stripHtml(raw.trim());
        if (!value) return 'Entry cannot be empty.';
        if (value.length > 200) return 'Entry must be under 200 characters.';
        setFormValues((prev) => {
            if (prev.misconfigurations.includes(value)) return prev;
            if (prev.misconfigurations.length >= 20) return prev;
            return { ...prev, misconfigurations: [...prev.misconfigurations, value] };
        });
        setFieldErrors((prev) => { const n = { ...prev }; delete n.misconfigurations; return n; });
        return null;
    }, []);

    const removeMisconfiguration = useCallback((value) => {
        setFormValues((prev) => ({
            ...prev,
            misconfigurations: prev.misconfigurations.filter((m) => m !== value),
        }));
    }, []);

    // ──────────────────────────────────────────────────────────────────────────
    // LOG SNIPPET
    // ──────────────────────────────────────────────────────────────────────────

    const setLogSnippet = useCallback((value) => {
        // Strip scripts immediately on change; HTML tags are preserved
        // (log lines often contain valid angle-bracket syntax)
        const safe = stripScripts(value);
        setFormValues((prev) => ({ ...prev, logSnippet: safe }));
        setFieldErrors((prev) => { const n = { ...prev }; delete n.logSnippet; return n; });
    }, []);

    const setIntelligenceLevel = useCallback((level) => {
        setFormValues(prev => ({ ...prev, intelligenceLevel: level }));
    }, []);

    // ──────────────────────────────────────────────────────────────────────────
    // RESET / CLEAR
    // ──────────────────────────────────────────────────────────────────────────

    const resetForm = useCallback(() => {
        // Abort any in-flight request first
        if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
        setFormValues({ ...defaultFormValues });
        setFieldErrors({});
        setError(null);
        setResult(null);
    }, []);

    const clearResult = useCallback(() => {
        setResult(null);
        setError(null);
    }, []);

    const cancelAnalysis = useCallback(() => {
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
        setLoading(false);
        setError(null);
    }, []);

    const loadHistoryItem = useCallback((id) => {
        const item = history.find(e => e.id === id);
        if (item && item.fullResult && item.savedFormValues) {
            if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
            setFormValues(item.savedFormValues);
            setResult(item.fullResult);
            setError(null);
            setFieldErrors({});
            setLoading(false);
        }
    }, [history]);

    // ──────────────────────────────────────────────────────────────────────────
    // SUBMIT — full lifecycle with normalization + sanitization
    // ──────────────────────────────────────────────────────────────────────────

    const handleSubmit = useCallback(async (e) => {
        if (e?.preventDefault) e.preventDefault();

        // ① Cancel any previous in-flight request
        if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }

        // ② Clear previous state
        setError(null);
        setFieldErrors({});
        setResult(null);

        // ③ Zod client-side validation
        const parsed = attackSimulationSchema.safeParse(formValues);
        if (!parsed.success) {
            const errors = {};
            parsed.error.errors.forEach(({ path, message }) => {
                const key = String(path[0] ?? 'form');
                if (!errors[key]) errors[key] = message;
            });
            setFieldErrors(errors);
            return;
        }

        // ④ Start loading
        setLoading(true);
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            // ⑤ Call API service (real or mock depending on VITE_USE_MOCK)
            const raw = await analyzeAttackChain(parsed.data, controller.signal);

            // ⑥ Normalize — reshape raw response to stable typed contract
            //    Throws if the response is completely malformed
            const normalized = normalizeResult(raw);

            // ⑦ Store normalized result — components only ever see clean data
            setResult(normalized);

            // ⑧ Append to history (max 5 entries, newest first)
            setHistory((prev) => [
                {
                    id: normalized.id,
                    timestamp: normalized.timestamp,
                    riskScore: normalized.riskScore,
                    portCount: formValues.openPorts.length,
                    // Summary is already sanitized by normalizeResult
                    summary: normalized.summary.slice(0, 120) + (normalized.summary.length > 120 ? '…' : ''),
                    fullResult: normalized,
                    savedFormValues: formValues,
                },
                ...prev.slice(0, 4),
            ]);

        } catch (err) {
            // ⑨ Cancelled by the user — silently ignore
            if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;

            // ⑩ Normalization error (malformed AI response)
            if (err?.message?.includes('Invalid response format')) {
                setError('The analysis engine returned an unexpected format. Please try again.');
                return;
            }

            // ⑪ API-layer errors (401/429/500/timeout/network) — already formatted
            //    by buildApiError() in analysisAPI.js; just surface the message.
            setError(
                sanitizeText(err?.message, 'Analysis failed. Please check your connection and retry.')
            );
        } finally {
            setLoading(false);
            abortRef.current = null;
        }
    }, [formValues]);

    // ──────────────────────────────────────────────────────────────────────────
    // PUBLIC API — everything a component needs, nothing it doesn't
    // ──────────────────────────────────────────────────────────────────────────

    return {
        // ── Lifecycle state ──────────────────────────────────────────────────
        loading,
        error,
        result,

        // ── Form state ───────────────────────────────────────────────────────
        formValues,
        fieldErrors,

        // ── History ──────────────────────────────────────────────────────────
        history,

        // ── Port actions ─────────────────────────────────────────────────────
        addPort,
        addPorts,
        removePort,

        // ── Misconfiguration actions ─────────────────────────────────────────
        addMisconfiguration,
        removeMisconfiguration,

        // ── Log snippet ──────────────────────────────────────────────────────
        setLogSnippet,
        setIntelligenceLevel,

        // ── Lifecycle actions ────────────────────────────────────────────────
        handleSubmit,
        resetForm,
        clearResult,
        cancelAnalysis,
        loadHistoryItem,
    };
}
