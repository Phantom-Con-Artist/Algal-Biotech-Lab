import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { useT } from '../../i18n/I18nProvider';

const SceneCanvas = lazy(() => import('../3d/SceneCanvas'));

export function SiteLayout() {
  const t = useT();
  return (
    <div className="relative flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only z-[60] bg-leaf px-4 py-3 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.nav.skip}
      </a>
      <ScrollToTop />
      <Suspense fallback={null}>
        <SceneCanvas />
      </Suspense>
      <Header />
      <main id="main" className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
