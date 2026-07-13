import { CILStore, CILBus } from '../../integrations/cil';

/**
 * Publish Threat Intelligence back to CIL.
 * @param {string} sessionId - The active CIL session ID
 * @param {object} analysisResults - ETH analysis output
 */
export function publishThreatIntelligence(sessionId, analysisResults) {
  let activeSessionId = sessionId;
  let isNewSession = !activeSessionId;

  if (isNewSession) {
    console.info(`[CIL] ETH: No sessionId provided. Will create a new session.`);
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
  
  // Format requested by CIL
  const payload = {
    tool: "ETH",
    attackPaths: attackPaths,
    mitre: mitreTechniques,
    threats: threats,
    killChain: analysisResults.killChain || [],
    iocs: analysisResults.iocs || [],
    risk: {
      threatScore: riskScore,
      riskLevel: riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low',
    }
  };

  if (isNewSession) {
    activeSessionId = CILStore.create({
      asset: { ip: 'UNKNOWN', os: 'UNKNOWN', ports: [] },
      exposures: [],
      ...payload,
      metadata: {
        eme: { published: false },
        eth: { published: true, publishedAt: new Date().toISOString() },
        etd: { published: false },
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    });
  } else {
    // Patch the existing session
    const currentSession = CILStore.get(activeSessionId) || {};
    CILStore.patch(activeSessionId, {
      ...payload,
      risk: {
        ...(currentSession.risk || {}),
        ...payload.risk,
        overallScore: Math.min(100, ((currentSession.risk?.exposureScore || 0) + riskScore) / 2)
      },
      metadata: {
        ...(currentSession.metadata || {}),
        eth: { published: true, publishedAt: new Date().toISOString() },
      },
    });
  }

  // Notify other open CyberEDT tabs
  CILBus.emit({ type: 'ETH_PUBLISHED', sessionId: activeSessionId, payload });

  console.info(`[CIL] ETH published threat intelligence to session: ${activeSessionId}`);
  return activeSessionId;
}
