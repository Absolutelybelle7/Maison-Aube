import Reveal from '@/components/common/Reveal';
import PageHero from '@/components/common/PageHero';
import { ErrorNotice, LoadingGrid } from '@/components/common/AsyncPlaceholders';
import StylistCard from '@/components/team/StylistCard';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchStylists } from '@/lib/salonApi';

export default function TeamPage() {
  const stylists = useAsyncData(fetchStylists, []);

  return (
    <>
      <PageHero
        eyebrow="Our team"
        title="Specialists who listen first"
        description="Our small team trains together and shares one belief: the best results come from patience, precision and a deep understanding of each client."
        imageUrl="https://images.pexels.com/photos/7195803/pexels-photo-7195803.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1200&fit=crop"
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        {stylists.status === 'loading' && (
          <LoadingGrid count={3} aspectClass="aspect-[3/4]" />
        )}
        {stylists.status === 'error' && <ErrorNotice message={stylists.error} />}
        {stylists.status === 'ready' && (
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {stylists.data.map((stylist, index) => (
              <Reveal key={stylist.id} delay={index * 120}>
                <StylistCard stylist={stylist} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-primary-100 bg-secondary-100">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-20 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2 className="mt-5 text-4xl text-primary-900 sm:text-5xl">Choose your specialist</h2>
          </div>
          <a href="#/book" className="btn-primary">
            Book appointment
          </a>
        </Reveal>
      </section>
    </>
  );
}
