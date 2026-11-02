import { useEffect, type ComponentType } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { ROUTES, useRoute, type RoutePath } from '@/lib/router';
import { SALON } from '@/lib/salonInfo';
import HomePage from '@/pages/HomePage';
import ServicesPage from '@/pages/ServicesPage';
import TeamPage from '@/pages/TeamPage';
import GalleryPage from '@/pages/GalleryPage';
import BookPage from '@/pages/BookPage';
import ContactPage from '@/pages/ContactPage';

const PAGES: Record<RoutePath, ComponentType> = {
  '/': HomePage,
  '/services': ServicesPage,
  '/team': TeamPage,
  '/gallery': GalleryPage,
  '/book': BookPage,
  '/contact': ContactPage,
};

function App() {
  const path = useRoute();
  const Page = PAGES[path];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = `${ROUTES[path]} | ${SALON.name}`;
  }, [path]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activePath={path} />
      <main id="content" className="flex-1">
        <Page />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
