import { formatSlotLabel } from '@/lib/bookingSlots';
import { formatLongDate, formatPrice } from '@/lib/format';
import type { BookingDraft } from '@/types/salon';

interface BookingSummaryProps {
  booking: BookingDraft;
}

interface SummaryRowProps {
  label: string;
  value: string | null;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-primary-100 py-4 last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-500">{label}</dt>
      <dd className={`text-right text-sm ${value ? 'font-semibold text-primary-900' : 'text-primary-400'}`}>
        {value ?? 'Not selected'}
      </dd>
    </div>
  );
}

export default function BookingSummary({ booking }: BookingSummaryProps) {
  const { service, stylist, date, time } = booking;

  return (
    <section className="rounded-3xl border border-primary-100 bg-white p-8" aria-label="Booking summary">
      <p className="eyebrow">Your visit</p>
      <h2 className="mt-4 font-display text-3xl text-primary-900">
        {service ? service.name : 'Select a treatment'}
      </h2>
      <dl className="mt-6">
        <SummaryRow label="Specialist" value={stylist?.name ?? null} />
        <SummaryRow label="Date" value={date ? formatLongDate(date) : null} />
        <SummaryRow label="Time" value={time ? formatSlotLabel(time) : null} />
        <SummaryRow label="Duration" value={service ? `${service.duration_minutes} min` : null} />
      </dl>
      <div className="mt-6 flex items-baseline justify-between border-t border-primary-900 pt-6">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Total</span>
        <span className="font-display text-3xl text-primary-900">
          {service ? formatPrice(service.price_cents) : '-'}
        </span>
      </div>
    </section>
  );
}
