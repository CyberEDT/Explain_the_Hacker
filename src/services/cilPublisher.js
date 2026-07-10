// ============================================================
// ETH — CIL Publisher Service
// After ETH generates attack paths and threat intelligence,
// this service patches the existing CIL session so ETD can
// consume it without any rescan or re-analysis.
// ============================================================

import { CILStore, CILBus } from '../integrations/cil';

/**
 * Patch the current CIL session with ETH-generated threat intelligence.
 * @param {string} sessionId - The active CIL session ID
 * @param {object} analysisResults - ETH analysis output
 */
export function publishThreatIntelligence(sessionId, analysisResults) {
  let activeSessionId = sessionId;
  let isNewSession = false;

  if (!activeSessionId) {
    activeSessionId = `cil-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    isNewSession = true;
    console.info(`[CIL] ETH: No sessionId provided. Created new session ${activeSessionId}.`);
  }

  const attackPaths = (analysisResults.attackPaths || []).map((path, idx) => ({
    id: `ap-eth-${idx}`,
    name: path.name || path.title || `Attack Path ${idx + 1}`,
    description: path.description || path.narrative || '',
    steps: (path.steps || path.phases || []).map((step, i) => ({
      stepNumber: i + 1,
      phase: step.phase || step.stage || '',
      technique: step.technique || step.name || '',
      techniqueId: step.techniqueId || step.id || '',
      description: step.description || '',
    })),
    likelihood: path.likelihood || 'likely',
    impact: path.impact || 'high',
    mitreTechniqueIds: path.mitreTechniques?.map(t => t.id || t) || [],
    source: 'ETH',
  }));

  const threats = (analysisResults.threats || analysisResults.threatActors || []).map((t, idx) => ({
    id: `thr-eth-${idx}`,
    name: t.name || `Threat ${idx + 1}`,
    category: t.category || 'Unknown',
    ttps: t.ttps || t.techniques || [],
    killChainPhases: t.killChainPhases || t.phases || [],
    description: t.description || '',
    source: 'ETH',
  }));

  const mitreTechniques = (analysisResults.mitreMappings || analysisResults.techniques || []).map(m => ({
    tacticId: m.tacticId || '',
    tacticName: m.tacticName || m.tactic || '',
    techniqueId: m.techniqueId || m.id || '',
    techniqueName: m.techniqueName || m.name || '',
  }));

  const riskScore = analysisResults.riskScore || analysisResults.threatScore || 0;

  if (isNewSession) {
    CILStore.set(activeSessionId, {
      asset: { ip: 'UNKNOWN', os: 'UNKNOWN', ports: [] },
      exposures: [],
      attackPaths,
      threats,
      mitreTechniques,
      risk: {
        exposureScore: 0,
        threatScore: riskScore,
        overallScore: riskScore,
        riskLevel: riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low',
      },
      metadata: {
        eme: { published: false },
        eth: { published: true, publishedAt: new Date().toISOString() },
        etd: { published: false },
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    });
  } else {
    // Patch the existing session — preserving EME exposure data
    CILStore.patch(activeSessionId, {
      attackPaths,
      threats,
      mitreTechniques,
      risk: {
        ...CILStore.get(activeSessionId)?.risk,
        threatScore: riskScore,
        overallScore: Math.min(100, (CILStore.get(activeSessionId)?.risk?.exposureScore || 0) + riskScore) / 2,
        riskLevel: riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low',
      },
      metadata: {
        ...CILStore.get(activeSessionId)?.metadata,
        eth: { published: true, publishedAt: new Date().toISOString() },
      },
    });
  }

  // Notify other open CyberEDT tabs
  CILBus.emit({ type: 'ETH_PUBLISHED', sessionId: activeSessionId });

  console.info(`[CIL] ETH published threat intelligence to session: ${activeSessionId}`);
  return activeSessionId;
}
