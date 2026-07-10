// ============================================================
// CIL — Inlined for ETH (no monorepo yet)
// ============================================================

const CIL_KEY_PREFIX = 'cyberedt:cil:';
const CIL_ACTIVE_KEY = 'cyberedt:cil:active';

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export const CILStore = {
  create(data) {
    const sessionId = `cil-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const session = { ...data, sessionId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const storage = getStorage();
    if (!storage) return sessionId;

    try {
      storage.setItem(`${CIL_KEY_PREFIX}${sessionId}`, JSON.stringify(session));
      storage.setItem(CIL_ACTIVE_KEY, sessionId);
    } catch (e) { console.error('[CIL] Save failed:', e); }
    return sessionId;
  },
  get(sessionId) {
    const storage = getStorage();
    if (!storage) return null;

    try {
      const raw = storage.getItem(`${CIL_KEY_PREFIX}${sessionId}`);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  getActive() {
    const storage = getStorage();
    if (!storage) return null;

    try {
      const id = storage.getItem(CIL_ACTIVE_KEY);
      return id ? this.get(id) : null;
    } catch {
      return null;
    }
  },
  patch(sessionId, updates) {
    const existing = this.get(sessionId);
    if (!existing) return;
    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    const storage = getStorage();
    if (!storage) return;

    try { storage.setItem(`${CIL_KEY_PREFIX}${sessionId}`, JSON.stringify(merged)); }
    catch (e) { console.error('[CIL] Patch failed:', e); }
  },
  setActive(sessionId) {
    const storage = getStorage();
    if (!storage) return;

    try { storage.setItem(CIL_ACTIVE_KEY, sessionId); }
    catch (e) { console.error('[CIL] Active session update failed:', e); }
  },
  clearAll() {
    const storage = getStorage();
    if (!storage) return;

    try {
      Object.keys(storage)
        .filter(k => k.startsWith(CIL_KEY_PREFIX))
        .forEach(k => storage.removeItem(k));
    } catch (e) { console.error('[CIL] Clear failed:', e); }
  },
};

let _channel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') _channel = new BroadcastChannel('cyberedt-cil');
} catch {
  _channel = null;
}
export const CILBus = {
  emit(event) { _channel?.postMessage(event); },
  on(handler) {
    if (!_channel) return () => {};
    const fn = e => handler(e.data);
    _channel.addEventListener('message', fn);
    return () => _channel?.removeEventListener('message', fn);
  },
};

const TOOL_URLS = {
  eme: import.meta.env?.VITE_EME_URL || 'https://explainmyexposure.cyberedt.com',
  etd: import.meta.env?.VITE_ETD_URL || 'https://explainthedefender.cyberedt.com',
  eth: import.meta.env?.VITE_ETH_URL || 'https://explainthehacker.cyberedt.com',
};
export const CILNavigator = {
  openInETD: (sessionId) => window.open(`${TOOL_URLS.etd}?cil=${sessionId}`, '_blank', 'noopener,noreferrer'),
  openInEME: (sessionId) => window.open(`${TOOL_URLS.eme}?cil=${sessionId}`, '_blank', 'noopener,noreferrer'),
  getSessionIdFromURL: () => new URLSearchParams(window.location.search).get('cil'),
};
