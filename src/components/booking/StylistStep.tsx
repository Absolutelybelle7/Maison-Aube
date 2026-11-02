import type { Stylist } from '@/types/salon';

interface StylistStepProps {
  stylists: Stylist[];
  selectedId: string | null;
  onSelect: (stylist: Stylist) => void;
}

export default function StylistStep({ stylists, selectedId, onSelect }: StylistStepProps) {
  return (
    <div>
      <h2 className="text-4xl text-primary-900">Choose your specialist</h2>
      <p className="mt-3 text-sm text-primary-600">Each specialist keeps their own schedule.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {stylists.map((stylist) => {
          const isSelected = stylist.id === selectedId;
          return (
            <button
              key={stylist.id}
              type="button"
              onClick={() => onSelect(stylist)}
              aria-pressed={isSelected}
              className={`group flex flex-col overflow-hidden rounded-2xl border bg-white text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
                isSelected
                  ? 'border-primary-900 shadow-[0_12px_30px_-18px_rgba(31,27,24,0.4)]'
                  : 'border-primary-200 hover:border-primary-500'
              }`}
            >
              {stylist.image_url && (
                <img
                  src={stylist.image_url}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              )}
              <span className="flex flex-1 flex-col p-5">
                <span className="font-display text-2xl text-primary-900">{stylist.name}</span>
                <span className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
                  {stylist.role}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
