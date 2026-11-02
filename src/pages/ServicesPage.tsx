import { useMemo, useState } from 'react';
import Reveal from '@/components/common/Reveal';
import PageHero from '@/components/common/PageHero';
import { ErrorNotice, LoadingGrid } from '@/components/common/AsyncPlaceholders';
import ServiceCard from '@/components/services/ServiceCard';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchServices } from '@/lib/salonApi';

const ALL_CATEGORIES = 'All';

export default function ServicesPage() {
  const services = useAsyncData(fetchServices, []);
  const [category, setCategory] = useState(ALL_CATEGORIES);

  const categories = useMemo(() => {
    if (services.status !== 'ready') return [ALL_CATEGORIES];
    return [ALL_CATEGORIES, ...new Set(services.data.map((service) => service.category))];
  }, [services]);

  const visibleServices = useMemo(() => {
    if (services.status !== 'ready') return [];
    return category === ALL_CATEGORIES
      ? services.data
      : services.data.filter((service) => service.category === category);
  }, [services, category]);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Treatments shaped around you"
        description="From a restorative head spa to precise cuts, luminous facials and unhurried massage, every service begins with a consultation."
        imageUrl="https://images.pexels.com/photos/6186740/pexels-photo-6186740.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1200&fit=crop"
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-wrap gap-3" role="group" aria-label="Filter services by category">
          {categories.map((item) => {
            const isActive = item === category;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={isActive}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
                  isActive
                    ? 'border-primary-900 bg-primary-900 text-secondary-50'
                    : 'border-primary-200 bg-white text-primary-700 hover:border-primary-900 hover:text-primary-900'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-16">
          {services.status === 'loading' && <LoadingGrid count={6} columns="sm:grid-cols-2 lg:grid-cols-3" />}
          {services.status === 'error' && <ErrorNotice message={services.error} />}
          {services.status === 'ready' && visibleServices.length === 0 && (
            <p className="py-20 text-center text-sm text-primary-600">No treatments are listed in this category yet.</p>
          )}
          {services.status === 'ready' && visibleServices.length > 0 && (
            <div key={category} className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {visibleServices.map((service, index) => (
                <Reveal key={service.id} delay={Math.min(index, 3) * 100}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
