import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlatformLayout from '@/components/PlatformLayout';
import LandingPage from '@/pages/LandingPage';
import ExplainTheHacker from '@/tools/ExplainTheHacker/ExplainTheHacker';
import Docs from '@/pages/Docs';
import ThreatIntel from '@/pages/ThreatIntel';
import AttackLibrary from '@/pages/AttackLibrary';
import Roadmap from '@/pages/Roadmap';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import ResponsibleUsage from '@/pages/ResponsibleUsage';
import SecurityDisclaimer from '@/pages/SecurityDisclaimer';
import ConsentBanner from '@/components/ConsentBanner';
import ScrollToTop from '@/components/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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

        {/* Attack Combination Library */}
        <Route
          path="/library"
          element={
            <PlatformLayout>
              <AttackLibrary />
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
      <ConsentBanner />
    </BrowserRouter>
  );
}
