import { Flower2 } from 'lucide-react';
import { ROUTES } from '@/lib/router';
import { SALON } from '@/lib/salonInfo';
import logo from '../../assets/images/logo.png';

const FOOTER_LINKS = ['/services', '/team', '/gallery', '/book', '/contact'] as const;

export default function SiteFooter() {
  return (
    <footer className="bg-primary-900 text-secondary-100">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
        <img src={logo} alt="" className="h-12 w-12 object-contain" />
            <span className="font-display text-2xl  font-medium text-secondary-50">{SALON.name}</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-secondary-300">
            {SALON.tagline}. Calm rituals for hair, skin and scalp, designed to slow you down.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="eyebrow text-accent-300">Visit</h2>
          <address className="space-y-1 text-sm not-italic leading-relaxed text-secondary-200">
            {SALON.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
          <p className="text-sm text-secondary-200">{SALON.hours}</p>
        </div>

        <div className="space-y-4">
          <h2 className="eyebrow text-accent-300">Explore</h2>
          <ul className="space-y-3 text-sm">
            {FOOTER_LINKS.map((path) => (
              <li key={path}>
                <a href={`#${path}`} className="link-underline text-secondary-200 hover:text-secondary-50">
                  {ROUTES[path]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="eyebrow text-accent-300">Contact</h2>
          <ul className="space-y-3 text-sm text-secondary-200">
            <li>
              <a href={SALON.phoneHref} className="link-underline hover:text-secondary-50">
                {SALON.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SALON.email}`} className="link-underline hover:text-secondary-50">
                {SALON.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-700">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-secondary-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} {SALON.name}. All rights reserved.</p>
          <p>Hair, skin and scalp studio</p>
        </div>
      </div>
    </footer>
  );
}
