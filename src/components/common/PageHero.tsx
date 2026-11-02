import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  imageUrl: string;
}

export default function PageHero({ eyebrow, title, description, action, imageUrl }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary-900">
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45 animate-slow-zoom"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-900 via-primary-900/80 to-primary-900/30" />
      <div className="mx-auto flex min-h-[380px] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 lg:px-10 lg:pb-20">
        <p className="eyebrow text-accent-300 animate-fade-in">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-5xl text-secondary-50 animate-fade-in sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-secondary-200 animate-fade-in">
          {description}
        </p>
        {action && <div className="mt-10 animate-fade-in">{action}</div>}
      </div>
    </section>
  );
}
