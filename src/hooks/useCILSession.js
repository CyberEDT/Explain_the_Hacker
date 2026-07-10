// ============================================================
// ETH CIL Session Hook
// Reads incoming intelligence from EME when ETH is opened with
// a ?cil=session-id URL parameter.
// ============================================================

import { useEffect, useState } from 'react';
import { CILBus, CILNavigator, CILStore } from '../integrations/cil';

function getInitialCILState() {
  const urlSessionId = CILNavigator.getSessionIdFromURL();

  if (urlSessionId) {
    const found = CILStore.get(urlSessionId);
    if (found) {
      CILStore.setActive(urlSessionId);
      console.info(`[CIL] ETH loaded session: ${urlSessionId}. EME exposures available.`);
      return { session: found, sessionId: urlSessionId };
    }
  }

  const active = CILStore.getActive();
  return active ? { session: active, sessionId: active.sessionId } : { session: null, sessionId: null };
}

export function useCILSession() {
  const [{ session, sessionId }, setCILState] = useState(getInitialCILState);

  useEffect(() => {
    return CILBus.on((event) => {
      if (event.type === 'EME_PUBLISHED') {
        const updated = CILStore.get(event.sessionId);
        if (updated) {
          setCILState({ session: updated, sessionId: event.sessionId });
        }
      }

      if (event.type === 'SESSION_CLEARED') {
        setCILState({ session: null, sessionId: null });
      }
    });
  }, []);

  return {
    session,
    sessionId,
    isFromCIL: !!session,
    hasEMEData: (session?.exposures?.length ?? 0) > 0,
    exposures: session?.exposures ?? [],
    asset: session?.asset ?? null,
    hasExposures: (session?.exposures?.length ?? 0) > 0,
    hasThreats: (session?.threats?.length ?? 0) > 0,
  };
}
