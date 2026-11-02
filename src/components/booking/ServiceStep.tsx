import { formatPrice } from '@/lib/format';
import type { Service } from '@/types/salon';

interface ServiceStepProps {
  services: Service[];
  selectedId: string | null;
  onSelect: (service: Service) => void;
}

export default function ServiceStep({ services, selectedId, onSelect }: ServiceStepProps) {
  return (
    <div>
      <h2 className="text-4xl text-primary-900">Choose your treatment</h2>
      <p className="mt-3 text-sm text-primary-600">Select the ritual you would like to book.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {services.map((service) => {
          const isSelected = service.id === selectedId;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service)}
              aria-pressed={isSelected}
              className={`group flex flex-col rounded-2xl border p-6 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
                isSelected
                  ? 'border-primary-900 bg-white shadow-[0_12px_30px_-18px_rgba(31,27,24,0.4)]'
                  : 'border-primary-200 bg-white/60 hover:border-primary-500 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
                  {service.category}
                </span>
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border transition ${
                    isSelected ? 'border-primary-900 bg-primary-900 ring-4 ring-primary-100' : 'border-primary-300'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <span className="mt-3 font-display text-2xl text-primary-900">{service.name}</span>
              <span className="mt-3 text-sm text-primary-600">
                {service.duration_minutes} min · {formatPrice(service.price_cents)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
