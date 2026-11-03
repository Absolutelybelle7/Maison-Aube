import { ArrowRight, Check } from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import { ErrorNotice, LoadingGrid } from '@/components/common/AsyncPlaceholders';
import ServiceCard from '@/components/services/ServiceCard';
import StylistCard from '@/components/team/StylistCard';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchServices, fetchStylists } from '@/lib/salonApi';
import { SALON } from '@/lib/salonInfo';

const PHILOSOPHY_POINTS = [
  'A private consultation before every treatment',
  'Certified organic botanicals from France and Japan',
  'Calm, unhurried rooms designed for stillness',
];

export default function HomePage() {
  const services = useAsyncData(fetchServices, []);
  const stylists = useAsyncData(fetchStylists, []);

  return (
    <>
      <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-end overflow-hidden bg-primary-900">
        <img
          src="https://images.pexels.com/photos/33412989/pexels-photo-33412989.png?auto=compress&cs=tinysrgb&w=1920&h=1200&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-900 via-primary-900/55 to-primary-900/10" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-10 lg:pb-28">
          <p className="eyebrow text-accent-300 animate-fade-in">East Cantoments</p>
          <h1 className="mt-6 max-w-4xl text-6xl leading-[1.04] text-secondary-50 animate-fade-in sm:text-7xl lg:text-8xl">
            Quiet luxury for hair, skin and scalp.
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-secondary-200 animate-fade-in">
            A serene studio of head spa rituals, precise haircuts and luminous facials, designed to
            slow you down and leave you radiant.
          </p>
          <div className="mt-12 flex flex-col gap-4 animate-fade-in sm:flex-row">
            <a
              href="#/book"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary-50 px-7 py-3.5 text-sm font-semibold tracking-wide text-primary-900 transition duration-300 hover:bg-accent-100"
            >
              Book appointment
            </a>
            <a
              href="#/services"
              className="btn-outline border-secondary-50 text-secondary-50 hover:bg-secondary-50 hover:text-primary-900"
            >
              Explore services
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:gap-24 lg:px-10 lg:py-32">
        <Reveal>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/27165072/pexels-photo-27165072.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop"
              alt="A bright salon interior with greenery and soft natural light"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
            <div className="absolute -bottom-8 -right-4 hidden max-w-[240px] rounded-2xl bg-secondary-50 p-6 shadow-[0_24px_60px_-20px_rgba(31,27,24,0.35)] sm:block">
              <p className="font-display text-5xl text-primary-900">60</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                Minute signature head spa ritual
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div>
            <p className="eyebrow">Our philosophy</p>
            <h2 className="mt-6 text-5xl text-primary-900 sm:text-6xl">Stillness first. Beauty follows.</h2>
            <p className="mt-8 text-base leading-relaxed text-primary-600">
              Every visit begins with listening. We study your hair, skin and scalp, then shape a
              ritual around what you need, using natural formulas and techniques refined over two
              decades of training.
            </p>
            <ul className="mt-10 space-y-5">
              {PHILOSOPHY_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-4 text-sm text-primary-800">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-700">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Signature treatments</p>
              <h2 className="mt-5 text-5xl text-primary-900 sm:text-6xl">Considered rituals</h2>
            </div>
            <a
              href="#/services"
              className="link-underline inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
            >
              View all services <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <div className="mt-16">
          {services.status === 'loading' && <LoadingGrid count={3} />}
          {services.status === 'error' && <ErrorNotice message={services.error} />}
          {services.status === 'ready' && (
            <div className="grid gap-10 md:grid-cols-3">
              {services.data.slice(0, 3).map((service, index) => (
                <Reveal key={service.id} delay={index * 120}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-primary-900 text-secondary-50">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-[640px]">
            <img
              src="https://images.pexels.com/photos/6629612/pexels-photo-6629612.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1400&fit=crop"
              alt="A candle-lit spa setting with plush towels"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <Reveal className="flex flex-col justify-center px-6 py-20 lg:px-20">
            <p className="eyebrow text-accent-300">The signature ritual</p>
            <h2 className="mt-6 text-5xl text-secondary-50 sm:text-6xl">The head spa, reimagined for Midtown.</h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-secondary-200">
              Our Signature Head Spa combines deep scalp cleansing, circulation work and a restorative
              neck and shoulder massage, finished with certified botanical oils.
            </p>
            <div className="mt-10">
              <a
                href="#/services"
                className="btn-outline border-secondary-50 text-secondary-50 hover:bg-secondary-50 hover:text-primary-900"
              >
                Discover head spa
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">The specialists</p>
              <h2 className="mt-5 text-5xl text-primary-900 sm:text-6xl">Meet your team</h2>
            </div>
            <a
              href="#/team"
              className="link-underline inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
            >
              Full team <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <div className="mt-16">
          {stylists.status === 'loading' && <LoadingGrid count={3} aspectClass="aspect-[3/4]" />}
          {stylists.status === 'error' && <ErrorNotice message={stylists.error} />}
          {stylists.status === 'ready' && (
            <div className="grid gap-10 md:grid-cols-3">
              {stylists.data.slice(0, 3).map((stylist, index) => (
                <Reveal key={stylist.id} delay={index * 120}>
                  <StylistCard stylist={stylist} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal>
          <div className="grid gap-10 rounded-3xl bg-accent-50 px-8 py-14 md:grid-cols-2 md:items-center lg:px-16">
            <div>
              <p className="eyebrow">Visit the studio</p>
              <h2 className="mt-5 text-4xl text-primary-900 sm:text-5xl">Your calm starts here.</h2>
              <p className="mt-6 text-sm leading-relaxed text-primary-700">
                {SALON.addressLines.join(', ')}. {SALON.hours}.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row md:justify-end">
              <a href="#/book" className="btn-primary">
                Book appointment
              </a>
              <a href={SALON.phoneHref} className="btn-outline">
                Call {SALON.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
