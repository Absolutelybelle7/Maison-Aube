import { useEffect, useState } from 'react';
import { Flower2, Menu, X } from 'lucide-react';
import { ROUTES, type RoutePath } from '@/lib/router';
import { SALON } from '@/lib/salonInfo';
import logo from '../../assets/images/logo.png';

const NAV_ITEMS: RoutePath[] = ['/services', '/team', '/gallery', '/contact'];

interface SiteHeaderProps {
  activePath: RoutePath;
}

export default function SiteHeader({ activePath }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [activePath]);

  return (
    <header
      className={`sticky top-0 z-40 bg-secondary-50/95 backdrop-blur-md transition-shadow duration-500 ${
        scrolled ? 'shadow-[0_1px_0_0_rgba(31,27,24,0.08)]' : 'shadow-none'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#/" className="group flex items-center gap-3" aria-label={`${SALON.name} home`}>
          <img src={logo} alt="" className="h-12 w-12 object-contain" />
          <span className="font-display text-2xl font-medium tracking-wide text-primary-900">
            {SALON.name}
          </span>
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              aria-current={activePath === item ? 'page' : undefined}
              className={`link-underline text-sm font-semibold tracking-wide transition-colors duration-300 ${
                activePath === item ? 'text-primary-900' : 'text-primary-600 hover:text-primary-900'
              }`}
            >
              {ROUTES[item]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#/book" className="btn-primary hidden px-6 py-2.5 md:inline-flex">
            Book appointment
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary-900 transition hover:bg-primary-100 md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-primary-100 bg-secondary-50 px-6 pb-8 pt-4 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="border-b border-primary-100 py-4 font-display text-2xl text-primary-900"
              >
                {ROUTES[item]}
              </a>
            ))}
          </nav>
          <a href="#/book" className="btn-primary mt-6 w-full">
            Book appointment
          </a>
        </div>
      )}
    </header>
  );
}
