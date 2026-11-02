import { CheckCircle2 } from 'lucide-react';
import BookingSummary from '@/components/booking/BookingSummary';
import type { CompleteBooking } from '@/types/salon';

interface BookingConfirmationProps {
  booking: CompleteBooking;
  onBookAnother: () => void;
}

export default function BookingConfirmation({ booking, onBookAnother }: BookingConfirmationProps) {
  return (
    <div className="space-y-10">
      <div className="flex items-start gap-5">
        <CheckCircle2 className="mt-1 h-12 w-12 shrink-0 text-success-700" strokeWidth={1.5} aria-hidden="true" />
        <div>
          <h2 className="text-5xl text-primary-900">Your request is received.</h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-primary-600">
            Thank you. We will email you to confirm your appointment. If you need to change anything,
            just call or write to us and we will take care of it.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <a href="#/" className="btn-outline">
          Back to home
        </a>
        <button type="button" onClick={onBookAnother} className="link-underline self-center text-sm font-semibold text-primary-900">
          Book another appointment
        </button>
      </div>

      <BookingSummary booking={booking} />
    </div>
  );
}
