import type { Service } from '@/types/salon';
import { formatPrice } from '@/lib/format';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary-200">
        {service.image_url && (
          <img
            src={service.image_url}
            alt={service.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-secondary-50/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-800">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-2xl text-primary-900">{service.name}</h3>
          <span className="shrink-0 text-sm font-semibold text-primary-800">
            {formatPrice(service.price_cents)}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-primary-600">{service.description}</p>
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">
            {service.duration_minutes} min
          </span>
          <a href="#/book" className="link-underline text-sm font-semibold text-primary-900">
            Book this treatment
          </a>
        </div>
      </div>
    </article>
  );
}
