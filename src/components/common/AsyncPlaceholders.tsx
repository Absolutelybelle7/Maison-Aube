import { AlertCircle } from 'lucide-react';

interface LoadingGridProps {
  count: number;
  columns?: string;
  aspectClass?: string;
}

export function LoadingGrid({ count, columns = 'md:grid-cols-3', aspectClass = 'aspect-[4/5]' }: LoadingGridProps) {
  return (
    <div className={`grid gap-10 ${columns}`} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className={`${aspectClass} rounded-2xl bg-secondary-200`} />
          <div className="mt-6 h-6 w-2/3 rounded bg-secondary-200" />
          <div className="mt-4 h-4 w-full rounded bg-secondary-100" />
          <div className="mt-2 h-4 w-4/5 rounded bg-secondary-100" />
        </div>
      ))}
    </div>
  );
}

interface ErrorNoticeProps {
  message: string;
}

export function ErrorNotice({ message }: ErrorNoticeProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-4 rounded-2xl border border-error-100 bg-error-50 p-6 text-error-700"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}
