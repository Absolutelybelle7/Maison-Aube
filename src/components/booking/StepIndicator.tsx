import { Check } from 'lucide-react';

const STEP_LABELS = ['Treatment', 'Specialist', 'Date and time', 'Your details'] as const;

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Booking progress">
      <ol className="grid grid-cols-4 gap-3">
        {STEP_LABELS.map((label, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <li key={label} className="space-y-3" aria-current={isCurrent ? 'step' : undefined}>
              <div
                className={`h-0.5 rounded-full transition-colors duration-500 ${
                  isDone || isCurrent ? 'bg-primary-900' : 'bg-primary-200'
                }`}
              />
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-500 ${
                    isDone
                      ? 'bg-success-700 text-secondary-50'
                      : isCurrent
                        ? 'bg-primary-900 text-secondary-50'
                        : 'bg-primary-100 text-primary-500'
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" /> : index + 1}
                </span>
                <span
                  className={`hidden text-xs font-semibold uppercase tracking-[0.12em] sm:inline ${
                    isCurrent ? 'text-primary-900' : 'text-primary-500'
                  }`}
                >
                  {label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
