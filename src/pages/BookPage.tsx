import { useState } from 'react';
import PageHero from '@/components/common/PageHero';
import { ErrorNotice, LoadingGrid } from '@/components/common/AsyncPlaceholders';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import BookingSummary from '@/components/booking/BookingSummary';
import DetailsStep from '@/components/booking/DetailsStep';
import ServiceStep from '@/components/booking/ServiceStep';
import ScheduleStep from '@/components/booking/ScheduleStep';
import StepIndicator from '@/components/booking/StepIndicator';
import StylistStep from '@/components/booking/StylistStep';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchServices, fetchStylists } from '@/lib/salonApi';
import type { BookingDraft, CompleteBooking, Service, Stylist } from '@/types/salon';

const LAST_STEP = 3;
const EMPTY_DRAFT: BookingDraft = { service: null, stylist: null, date: null, time: null };

function toCompleteBooking(draft: BookingDraft): CompleteBooking | null {
  const { service, stylist, date, time } = draft;
  return service && stylist && date && time ? { service, stylist, date, time } : null;
}

async function loadCatalog(): Promise<{ services: Service[]; stylists: Stylist[] }> {
  const [services, stylists] = await Promise.all([fetchServices(), fetchStylists()]);
  return { services, stylists };
}

export default function BookPage() {
  const catalog = useAsyncData(loadCatalog, []);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [confirmed, setConfirmed] = useState<CompleteBooking | null>(null);

  const canContinue =
    (step === 0 && draft.service !== null) ||
    (step === 1 && draft.stylist !== null) ||
    (step === 2 && draft.date !== null && draft.time !== null);

  const selectService = (service: Service) => {
    setDraft((current) => ({ ...current, service, time: null }));
  };

  const selectStylist = (stylist: Stylist) => {
    setDraft((current) => ({ ...current, stylist, time: null }));
  };

  const resetBooking = () => {
    setDraft(EMPTY_DRAFT);
    setStep(0);
    setConfirmed(null);
  };

  const renderStep = () => {
    if (catalog.status !== 'ready') return null;
    const { services, stylists } = catalog.data;

    if (step === 0) {
      return (
        <ServiceStep
          services={services}
          selectedId={draft.service?.id ?? null}
          onSelect={selectService}
        />
      );
    }
    if (step === 1) {
      return (
        <StylistStep
          stylists={stylists}
          selectedId={draft.stylist?.id ?? null}
          onSelect={selectStylist}
        />
      );
    }
    if (step === 2 && draft.service && draft.stylist) {
      return (
        <ScheduleStep
          durationMinutes={draft.service.duration_minutes}
          stylistId={draft.stylist.id}
          date={draft.date}
          time={draft.time}
          onDateChange={(date) => setDraft((current) => ({ ...current, date, time: null }))}
          onTimeChange={(time) => setDraft((current) => ({ ...current, time }))}
        />
      );
    }
    const complete = toCompleteBooking(draft);
    if (step === LAST_STEP && complete) {
      return <DetailsStep booking={complete} onBooked={() => setConfirmed(complete)} />;
    }
    return null;
  };

  return (
    <>
      <PageHero
        eyebrow="Book appointment"
        title="Reserve your ritual"
        description="Choose your treatment, your specialist and a time that suits you. We will confirm every request personally."
        imageUrl="https://images.pexels.com/photos/6629605/pexels-photo-6629605.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1200&fit=crop"
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_360px] lg:gap-16 lg:px-10 lg:py-24">
        <div className="min-w-0">
          {catalog.status === 'loading' && <LoadingGrid count={4} columns="sm:grid-cols-2" aspectClass="aspect-[3/2]" />}
          {catalog.status === 'error' && <ErrorNotice message={catalog.error} />}

          {catalog.status === 'ready' && confirmed && (
            <BookingConfirmation booking={confirmed} onBookAnother={resetBooking} />
          )}

          {catalog.status === 'ready' && !confirmed && (
            <>
              <StepIndicator currentStep={step} />
              <div key={step} className="mt-14 animate-fade-in">
                {renderStep()}
              </div>

              {step < LAST_STEP && (
                <div className="mt-14 flex items-center justify-between gap-4 border-t border-primary-100 pt-8">
                  <button
                    type="button"
                    onClick={() => setStep((current) => Math.max(0, current - 1))}
                    disabled={step === 0}
                    className="text-sm font-semibold text-primary-600 transition hover:text-primary-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep((current) => current + 1)}
                    disabled={!canContinue}
                    className="btn-primary"
                  >
                    Continue
                  </button>
                </div>
              )}

              {step === LAST_STEP && (
                <div className="mt-10 border-t border-primary-100 pt-8">
                  <button
                    type="button"
                    onClick={() => setStep(LAST_STEP - 1)}
                    className="text-sm font-semibold text-primary-600 transition hover:text-primary-900"
                  >
                    Back to date and time
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {!confirmed && (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <BookingSummary booking={draft} />
          </aside>
        )}
      </section>
    </>
  );
}
