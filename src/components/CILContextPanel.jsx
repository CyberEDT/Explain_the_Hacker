import React from 'react';
import { useCILSession } from '../hooks/useCILSession';
import { CILNavigator, CILStore } from '../integrations/cil';
import { publishThreatIntelligence } from '../services/cilPublisher';
// Removed lucide-react imports to fix potential useContext crash

const sev = { critical: '#f87171', high: '#fb923c', medium: '#fbbf24', low: '#22d3ee', informational: '#64748b' };

/**
 * CILContextPanel — ETH Hacker Theme
 */
export default function CILContextPanel({ analysisResults }) {
  const { sessionId, isFromCIL, hasEMEData, exposures, asset } = useCILSession();
  const [ethPublished, setEthPublished] = React.useState(false);
  const [localSessionId, setLocalSessionId] = React.useState(null);

  const activeSessionId = sessionId || localSessionId;

  const handlePublishToETD = () => {
    if (!analysisResults) return;
    const newSessionId = publishThreatIntelligence(activeSessionId, analysisResults);
    if (!activeSessionId && newSessionId) {
      setLocalSessionId(newSessionId);
    }
    setEthPublished(true);
  };

  // Only show the panel if we came from EME (via CIL) OR if we have analysis results to share
  if (!isFromCIL && !analysisResults) return null;

  return (
    <div style={{
      border: '1px solid #1f1f1f',
      background: 'rgba(255,255,255,0.015)',
      padding: '20px',
      marginBottom: '24px',
      fontFamily: 'var(--font-mono, monospace)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', background: '#f87171', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#f87171', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            CYBEREDT_SESSION_ACTIVE
          </span>
        </div>
        
        {/* Status Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.6rem', color: hasEMEData ? '#4ade80' : '#444', border: `1px solid ${hasEMEData ? '#4ade80' : '#333'}`, padding: '2px 6px', textTransform: 'uppercase' }}>
            EME {hasEMEData ? '[OK]' : '[--]'}
          </span>
          <span style={{ fontSize: '0.6rem', color: '#f87171', border: '1px solid #f87171', padding: '2px 6px', textTransform: 'uppercase' }}>
            ETH [ACTIVE]
          </span>
          <span style={{ fontSize: '0.6rem', color: activeSessionId && ethPublished ? '#38bdf8' : '#444', border: `1px solid ${activeSessionId && ethPublished ? '#38bdf8' : '#333'}`, padding: '2px 6px', textTransform: 'uppercase' }}>
            ETD {activeSessionId && ethPublished ? '[WAIT]' : '[--]'}
          </span>
        </div>
      </div>

      {/* Details Row */}
      {activeSessionId && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed #222', borderBottom: '1px dashed #222', padding: '12px 0', marginBottom: '20px' }}>
          {asset ? (
            <div style={{ fontSize: '0.65rem', color: '#888' }}>
              
              <span style={{ color: '#aaa', letterSpacing: '0.05em' }}>{asset.hostname || asset.ip || 'UNKNOWN_ASSET'}</span>
              {asset.os && <span style={{ marginLeft: '12px', color: '#555' }}>[{asset.os}]</span>}
            </div>
          ) : (
             <div style={{ fontSize: '0.65rem', color: '#666' }}>&gt; ASSET_INFO_UNAVAILABLE</div>
          )}
          <div style={{ fontSize: '0.65rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
             SESSION_ID: {activeSessionId.slice(-8)}
          </div>
        </div>
      )}

      {/* Body: Exposures & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Imported Exposures */}
        {hasEMEData && exposures.length > 0 && (
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ fontSize: '0.6rem', color: '#555', marginBottom: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              &gt; IMPORTED_EXPOSURES ({exposures.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {exposures.slice(0, 8).map((exp) => (
                <span key={exp.id} style={{
                  padding: '4px 8px', fontSize: '0.65rem', fontWeight: '700',
                  background: `${sev[exp.severity]}10`, color: sev[exp.severity], border: `1px solid ${sev[exp.severity]}30`,
                }}>
                  {exp.port}/{exp.protocol} {exp.service}
                </span>
              ))}
              {exposures.length > 8 && (
                <span style={{ padding: '4px 8px', fontSize: '0.6rem', color: '#555', border: '1px dashed #333' }}>
                  +{exposures.length - 8} MORE
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {isFromCIL && (
            <button
              onClick={() => CILNavigator.openInEME(activeSessionId)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '0.65rem', color: '#4ade80', background: 'transparent', border: '1px solid rgba(74,222,128,0.3)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(74,222,128,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
               VIEW_IN_EME
            </button>
          )}
          
          {analysisResults && (
            <>
              {!ethPublished ? (
                <button
                  onClick={handlePublishToETD}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.65rem', color: '#f87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.4)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                >
                   PUBLISH_TO_ETD
                </button>
              ) : (
                <>
                  <div style={{ fontSize: '0.6rem', color: '#4ade80', textTransform: 'uppercase', marginTop: '4px', textAlign: 'right' }}>
                    [INTELLIGENCE_SENT]
                  </div>
                  <button
                    onClick={() => CILNavigator.openInETD(activeSessionId)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '0.65rem', color: '#38bdf8', background: 'transparent', border: '1px solid rgba(56,189,248,0.3)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56,189,248,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                     OPEN_IN_ETD
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
