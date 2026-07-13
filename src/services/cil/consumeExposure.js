import { CILStore, CILNavigator } from '../../integrations/cil';

/**
 * Consume Exposure Intelligence from CIL.
 * If CIL is active, extract ports, misconfigurations, and logs.
 * Returns null if CIL is unavailable, allowing ETH to work standalone.
 */
export function consumeExposureIntelligence() {
    let sessionId = CILNavigator.getSessionIdFromURL();
    let session = null;

    if (sessionId) {
        session = CILStore.get(sessionId);
        if (session) {
            CILStore.setActive(sessionId);
        }
    } else {
        session = CILStore.getActive();
        sessionId = session?.sessionId;
    }

    if (!session || !session.exposures) {
        return null; // CIL unavailable or no exposures
    }

    // Extract intelligence
    const openPorts = [];
    const misconfigurations = [];
    let logSnippet = '';

    session.exposures.forEach(exposure => {
        if (exposure.port) {
            openPorts.push(String(exposure.port));
        }
        if (exposure.misconfig) {
            misconfigurations.push(exposure.misconfig);
        }
    });

    // Optionally extract logs if present in the session (e.g., in asset or metadata)
    if (session.asset && session.asset.logs) {
        logSnippet = session.asset.logs;
    }

    return {
        sessionId,
        openPorts: [...new Set(openPorts)],
        misconfigurations: [...new Set(misconfigurations)],
        logSnippet
    };
}
