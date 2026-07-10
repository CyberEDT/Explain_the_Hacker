import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlatformLayout from '@/components/PlatformLayout';
import ConsentBanner from '@/components/ConsentBanner';
import ScrollToTop from '@/components/ScrollToTop';
import AppErrorBoundary from '@/components/AppErrorBoundary';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const ExplainTheHacker = lazy(() => import('@/tools/ExplainTheHacker/ExplainTheHacker'));
const Docs = lazy(() => import('@/pages/Docs'));
const ThreatIntel = lazy(() => import('@/pages/ThreatIntel'));
const AttackLibrary = lazy(() => import('@/pages/AttackLibrary'));
const KillChain = lazy(() => import('@/pages/KillChain'));
const Tactics = lazy(() => import('@/pages/Tactics'));
const Roadmap = lazy(() => import('@/pages/Roadmap'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const ResponsibleUsage = lazy(() => import('@/pages/ResponsibleUsage'));
const SecurityDisclaimer = lazy(() => import('@/pages/SecurityDisclaimer'));

export default function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="app-fallback-screen">INITIALIZING PLATFORM...</div>}>
          <Routes>
        {/* Home — landing/marketing page */}
        <Route
          path="/"
          element={
            <PlatformLayout>
              <LandingPage />
            </PlatformLayout>
          }
        />

        {/* Lab — the actual threat simulation tool */}
        <Route
          path="/lab"
          element={
            <PlatformLayout>
              <ExplainTheHacker />
            </PlatformLayout>
          }
        />

        {/* Documentation */}
        <Route
          path="/docs"
          element={
            <PlatformLayout>
              <Docs />
            </PlatformLayout>
          }
        />

        {/* Threat Intel Hub */}
        <Route
          path="/threat-intel"
          element={
            <PlatformLayout>
              <ThreatIntel />
            </PlatformLayout>
          }
        />

        {/* Attack Library */}
        <Route
          path="/library"
          element={
            <PlatformLayout>
              <AttackLibrary />
            </PlatformLayout>
          }
        />

        {/* Kill Chain */}
        <Route
          path="/killchain"
          element={
            <PlatformLayout>
              <KillChain />
            </PlatformLayout>
          }
        />

        {/* Tactics */}
        <Route
          path="/tactics"
          element={
            <PlatformLayout>
              <Tactics />
            </PlatformLayout>
          }
        />

        {/* ETH Roadmap */}
        <Route
          path="/roadmap"
          element={
            <PlatformLayout>
              <Roadmap />
            </PlatformLayout>
          }
        />

        {/* Legal Pages */}
        <Route path="/privacy" element={<PlatformLayout><PrivacyPolicy /></PlatformLayout>} />
        <Route path="/terms" element={<PlatformLayout><TermsOfService /></PlatformLayout>} />
        <Route path="/ethics" element={<PlatformLayout><ResponsibleUsage /></PlatformLayout>} />
        <Route path="/disclaimer" element={<PlatformLayout><SecurityDisclaimer /></PlatformLayout>} />

        {/* Catch-all → home */}
        <Route
          path="*"
          element={
            <PlatformLayout>
              <LandingPage />
            </PlatformLayout>
          }
        />
          </Routes>
        </Suspense>
        <ConsentBanner />
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
