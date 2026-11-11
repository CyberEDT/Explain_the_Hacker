export const ANALYSIS_MODE_POLICIES = Object.freeze({
    LOW: Object.freeze({
        audience: 'Beginners and students',
        depth: 'Concise, plain-language findings',
        terminology: 'Accessible terms; explain acronyms when used',
        includeCorrelations: false,
        includeAttackPath: false,
        includeAdvancedAnalysis: false,
    }),
    MEDIUM: Object.freeze({
        audience: 'Practitioners and security analysts',
        depth: 'Evidence-linked technical analysis',
        terminology: 'Standard security operations terminology',
        includeCorrelations: true,
        includeAttackPath: true,
        includeAdvancedAnalysis: false,
    }),
    HIGH: Object.freeze({
        audience: 'Professional analysts and investigators',
        depth: 'Multi-source investigative analysis',
        terminology: 'Technical investigative terminology with explicit uncertainty',
        includeCorrelations: true,
        includeAttackPath: true,
        includeAdvancedAnalysis: true,
    }),
});

const EVIDENCE_CLASSES = new Set(['OBSERVED', 'INFERRED', 'HYPOTHETICAL', 'VERIFIED', 'NOT_OBSERVED', 'UNKNOWN']);

export function normalizeAnalysisMode(value = 'LOW') {
    const mode = String(value || 'LOW').trim().toUpperCase();
    if (mode === 'LE') return 'HIGH';
    return Object.prototype.hasOwnProperty.call(ANALYSIS_MODE_POLICIES, mode) ? mode : 'LOW';
}

export function applyValidationConfidencePenalty(score, { contradictions = [], warnings = [] } = {}) {
    if (!Number.isFinite(score)) return 0;
    const penalty = Math.min(20, (contradictions.length * 8) + (warnings.length * 2));
    return Math.max(8, Math.min(98, Math.round(score - penalty)));
}

function evidenceClass(value, fallback = 'UNKNOWN') {
    const normalized = String(value || '').trim().toUpperCase().replaceAll(' ', '_');
    return EVIDENCE_CLASSES.has(normalized) ? normalized : fallback;
}

function uniqueStrings(values) {
    return [...new Set((Array.isArray(values) ? values : []).filter(value => typeof value === 'string' && value.trim()).map(value => value.trim()))];
}

function getFindings(result) {
    const findings = Array.isArray(result.verifiedFindings) ? result.verifiedFindings : [];
    return findings.map(finding => {
        const title = finding.finding || finding.title || 'Assessment observation';
        const misconfig = (Array.isArray(result.misconfigIntelligence) ? result.misconfigIntelligence : [])
            .find(item => item.finding === title);
        const service = (Array.isArray(result.serviceIntelligence) ? result.serviceIntelligence : [])
            .find(item => title.toLowerCase().includes(String(item.service || '').toLowerCase()));
        const context = finding.whyItMatters || finding.explanation || finding.detail ||
            misconfig?.intel?.['Why It Matters'] || misconfig?.intel?.['Security Impact'] ||
            service?.intel?.['Why Attackers Target It'];
        return {
            title,
            type: finding.type || 'observation',
            classification: evidenceClass(finding.classification, 'OBSERVED'),
            evidenceReferences: uniqueStrings([
                typeof finding.evidence === 'string' ? finding.evidence : null,
                ...(Array.isArray(finding.evidenceReferences) ? finding.evidenceReferences : []),
            ]),
            whyItMatters: context
                ? `${context} This is contextual risk information, not evidence that the activity occurred.`
                : 'This was present in the supplied assessment data. Review the observation; it does not by itself establish successful access or compromise.',
            confidence: Number.isFinite(finding.confidence) ? finding.confidence : null,
        };
    });
}

function getRecommendations(result, concise) {
    const recommendations = Array.isArray(result.mitigations) ? result.mitigations : [];
    const prioritized = [...recommendations].sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return (order[String(a.priority || '').toLowerCase()] ?? 4) - (order[String(b.priority || '').toLowerCase()] ?? 4);
    });
    const essential = prioritized.filter(item => ['critical', 'high'].includes(String(item.priority || '').toLowerCase()));
    const selected = concise ? (essential.length ? essential.slice(0, 4) : prioritized.slice(0, 3)) : prioritized;
    return selected.map(item => ({
        title: item.title || 'Recommended action',
        priority: item.priority || 'unspecified',
        rationale: item.description || '',
        evidenceReferences: uniqueStrings(item.evidenceReferences),
    }));
}

function getAttackPath(result) {
    return (Array.isArray(result.killChain) ? result.killChain : []).map(stage => ({
        phase: stage.phase || 'Unknown phase',
        status: evidenceClass(stage.status, 'UNKNOWN'),
        explanation: stage.explanation || '',
        evidenceReferences: uniqueStrings(stage.supportingEvidence),
        techniques: (Array.isArray(stage.techniques) ? stage.techniques : []).map(technique => ({
            id: technique.id || '',
            name: technique.name || 'Unspecified technique',
            tactic: technique.tactic || '',
            classification: evidenceClass(technique.classification || technique.evidenceType, 'UNKNOWN'),
            evidenceReferences: uniqueStrings(technique.generatedBecause || technique.evidenceReferences),
        })),
    }));
}

function collectGaps(result) {
    const warnings = result.validationMetadata?.warnings;
    const contradictions = result.validationMetadata?.contradictions;
    const sources = result.confidenceMetrics?.dataSources;
    return uniqueStrings([
        ...(Array.isArray(warnings) ? warnings : []),
        ...(Array.isArray(result.frameworkWarnings) ? result.frameworkWarnings : []),
        ...(Array.isArray(contradictions) ? contradictions.map(item => `Contradictory evidence: ${typeof item === 'string' ? item : JSON.stringify(item)}`) : []),
        ...(Array.isArray(sources) ? sources.filter(source => /no .*(?:provided|telemetry)|missing|not provided|not determinable|confidence limited/i.test(source)) : []),
    ]);
}

function getDetectionOpportunities(result) {
    const intelligence = Array.isArray(result.misconfigIntelligence) ? result.misconfigIntelligence : [];
    return uniqueStrings(intelligence.flatMap(item => {
        const opportunities = item.intel?.['Detection Opportunities'];
        return typeof opportunities === 'string' ? opportunities.split(/\r?\n|•/).map(line => line.replace(/^\s*[-*]\s*/, '')) : [];
    }));
}

function getMitreMappings(result) {
    return (Array.isArray(result.ATTACKMappings) ? result.ATTACKMappings : []).map(mapping => ({
        id: mapping.mitreId || mapping.id || '',
        name: mapping.name || mapping.technique || '',
        tactic: mapping.tactic || '',
        classification: evidenceClass(mapping.classification || mapping.evidenceType, 'UNKNOWN'),
        evidenceReferences: uniqueStrings(mapping.evidenceReferences || mapping.generatedBecause),
    }));
}

export function buildModeAnalysisReport(result, requestedMode = result?.intelligenceLevel) {
    const analysisMode = normalizeAnalysisMode(requestedMode);
    const policy = ANALYSIS_MODE_POLICIES[analysisMode];
    const findings = getFindings(result);
    const recommendations = getRecommendations(result, analysisMode === 'LOW');
    const correlationDetails = Array.isArray(result.correlationIntelligence) ? result.correlationIntelligence : [];
    const correlations = (Array.isArray(result.inferredRisks) ? result.inferredRisks : []).map(item => {
        const detail = correlationDetails.find(candidate => candidate.id === item.id);
        return {
            title: item.risk || item.name || detail?.name || 'Correlated risk',
            classification: evidenceClass(item.classification, 'INFERRED'),
            likelihood: item.likelihood || 'UNASSESSED',
            explanation: detail?.threat || item.explanation || '',
            evidenceReferences: uniqueStrings(detail?.generatedBecause || item.evidenceReferences),
            mitreId: item.mitreId || detail?.mitre || '',
        };
    });
    const attackPath = getAttackPath(result);
    const gaps = collectGaps(result);
    const mappings = getMitreMappings(result);
    const observedCount = findings.filter(item => ['OBSERVED', 'VERIFIED'].includes(item.classification)).length;
    const inferredCount = correlations.length;
    const hypotheticalCount = (Array.isArray(result.hypotheticalScenarios) ? result.hypotheticalScenarios : []).length;
    const riskScore = Number.isFinite(result.riskScore) ? result.riskScore : null;
    const confidenceScore = Number.isFinite(result.confidenceScore) ? result.confidenceScore : null;

    let executiveSummary;
    if (analysisMode === 'LOW') {
        executiveSummary = findings.length
            ? `ETH found ${findings.length} observation(s) in the supplied data. These are items to review, not proof that an attacker succeeded.`
            : 'No findings were extracted from the supplied data. This does not prove that no security issue or activity exists.';
    } else if (analysisMode === 'MEDIUM') {
        executiveSummary = `ETH identified ${findings.length} evidence-backed observation(s) and ${correlations.length} inferred correlation(s). ${gaps.length ? `${gaps.length} evidence gap(s) or validation issue(s) limit the assessment.` : 'No listed evidence gaps or validation issues were supplied.'}`;
    } else {
        executiveSummary = `Advanced review: ${observedCount} observed/verified finding(s), ${inferredCount} inferred correlation(s), and ${hypotheticalCount} explicitly hypothetical scenario(s) are available for analysis. ${gaps.length ? `The assessment includes ${gaps.length} evidence gap(s) or contradiction(s).` : 'No evidence gaps or contradictions were reported by the supplied analysis.'}`;
    }

    const report = {
        analysisMode,
        policy,
        executiveSummary,
        findings,
        recommendations,
        mitreMappings: mappings,
        warnings: collectGaps(result),
    };

    if (policy.includeCorrelations) {
        report.correlations = correlations;
        report.riskPrioritization = {
            riskScore,
            factors: Array.isArray(result.topRiskFactors) ? result.topRiskFactors : [],
        };
        report.impactAnalysis = result.riskAssessment && typeof result.riskAssessment === 'object'
            ? {
                basis: result.riskAssessment.scoringBasis || '',
                dimensions: Array.isArray(result.riskAssessment.dimensions) ? result.riskAssessment.dimensions : [],
            }
            : null;
        report.confidenceAnalysis = {
            score: confidenceScore,
            explanation: 'Confidence is inherited from the evidence assessment and is not increased by selecting a deeper analysis mode.',
            gaps,
        };
    }

    if (policy.includeAttackPath) {
        report.attackPath = attackPath;
    }

    if (policy.includeAdvancedAnalysis) {
        report.defensiveGaps = findings
            .filter(finding => finding.type === 'misconfiguration')
            .map(finding => ({
                title: finding.title,
                classification: finding.classification,
                evidenceReferences: finding.evidenceReferences,
            }));
        report.alternativeHypotheses = (Array.isArray(result.hypotheticalScenarios) ? result.hypotheticalScenarios : []).map(scenario => ({
            ...scenario,
            title: scenario.phase || 'Alternative scenario',
            classification: 'HYPOTHETICAL',
            explanation: scenario.scenario || 'No scenario details supplied.',
            prerequisites: uniqueStrings(scenario.prerequisites),
            evidenceReferences: uniqueStrings(scenario.evidenceReferences),
        })).filter(hypothesis => hypothesis.prerequisites.length > 0 || hypothesis.evidenceReferences.length > 0);
        report.detectionOpportunities = getDetectionOpportunities(result);
        report.threatIntelligenceContext = (Array.isArray(result.correlationIntelligence) ? result.correlationIntelligence : []).map(item => ({
            correlation: item.name || item.id || 'Correlation context',
            referenceGroups: uniqueStrings(item.targetedBy),
            status: 'REFERENCE_CONTEXT_NOT_ATTRIBUTION',
            evidenceReferences: uniqueStrings(item.generatedBecause),
        })).filter(item => item.referenceGroups.length > 0);
        report.investigation = {
            gaps,
            questions: gaps.length
                ? ['Which additional telemetry or authoritative source could resolve each listed gap or contradiction?']
                : [],
            recommendations: gaps.map(gap => `Validate or obtain evidence to resolve: ${gap}`),
            stageReview: attackPath.map(stage => ({
                phase: stage.phase,
                classification: stage.status,
                assessment: stage.explanation,
                evidenceReferences: stage.evidenceReferences,
                mappedTechniques: stage.techniques,
            })),
        };
        report.hypothesisAnalysis = {
            methodology: 'Relative support is ordered by evidence classification: OBSERVED/VERIFIED evidence is stronger than INFERRED correlations, while HYPOTHETICAL scenarios remain unconfirmed until their prerequisites are verified.',
            hypotheses: [
                ...correlations.map(item => ({
                    title: item.title,
                    classification: item.classification,
                    supportingEvidence: item.evidenceReferences,
                    limitation: 'Correlation supports an analytical path, not proof that the activity occurred.',
                })),
                ...report.alternativeHypotheses.map(item => ({
                    title: item.title,
                    classification: item.classification,
                    supportingEvidence: item.evidenceReferences,
                    limitation: item.prerequisites.length
                        ? `Prerequisites remain to be verified: ${item.prerequisites.join('; ')}.`
                        : 'No validating prerequisite was supplied.',
                })),
            ],
        };
    }

    return report;
}

export function applyAnalysisMode(result, requestedMode) {
    const analysisMode = normalizeAnalysisMode(requestedMode);
    const report = buildModeAnalysisReport(result, analysisMode);
    const odp = Array.isArray(result.odp)
        ? result.odp.map(step => step.step === 6
            ? { ...step, narrativeSnippet: `${report.executiveSummary.slice(0, 150)}${report.executiveSummary.length > 150 ? '...' : ''}` }
            : step)
        : result.odp;
    return {
        ...result,
        odp,
        intelligenceLevel: analysisMode,
        analysisMode,
        analysisReport: report,
        summary: report.executiveSummary,
    };
}
