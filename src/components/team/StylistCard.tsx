import type { Stylist } from '@/types/salon';

interface StylistCardProps {
  stylist: Stylist;
}

export default function StylistCard({ stylist }: StylistCardProps) {
  const firstName = stylist.name.split(' ')[0];

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary-200">
        {stylist.image_url && (
          <img
            src={stylist.image_url}
            alt={stylist.name}
            loading="lazy"
            className="h-full w-full object-cover grayscale-[30%] transition duration-[1200ms] ease-out group-hover:scale-105 group-hover:grayscale-0"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col pt-6">
        <h3 className="text-2xl text-primary-900">{stylist.name}</h3>
        <p className="eyebrow mt-2 text-accent-700">{stylist.role}</p>
        <p className="mt-4 text-sm leading-relaxed text-primary-600">{stylist.bio}</p>
        <div className="mt-auto pt-6">
          <a href="#/book" className="link-underline text-sm font-semibold text-primary-900">
            Book with {firstName}
          </a>
        </div>
      </div>
    </article>
  );
}
