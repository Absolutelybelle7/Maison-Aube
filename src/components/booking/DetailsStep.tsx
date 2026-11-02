import { useState, type FormEvent } from 'react';
import Field from '@/components/common/Field';
import { createAppointment } from '@/lib/salonApi';
import { isValidEmail, isValidPhone } from '@/lib/validation';
import type { CompleteBooking } from '@/types/salon';

interface DetailsValues {
  name: string;
  email: string;
  phone: string;
  notes: string;
}
type DetailsErrors = Partial<Record<keyof DetailsValues, string>>;

const EMPTY_VALUES: DetailsValues = { name: '', email: '', phone: '', notes: '' };

function validate(values: DetailsValues): DetailsErrors {
  const errors: DetailsErrors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!isValidEmail(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!isValidPhone(values.phone.trim())) errors.phone = 'Please enter a valid phone number.';
  if (values.notes.trim().length > 1000) errors.notes = 'Please keep notes under 1,000 characters.';
  return errors;
}

interface DetailsStepProps {
  booking: CompleteBooking;
  onBooked: () => void;
}

export default function DetailsStep({ booking, onBooked }: DetailsStepProps) {
  const [values, setValues] = useState<DetailsValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<DetailsErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const updateField = (field: keyof DetailsValues) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError(null);
    try {
      await createAppointment({
        service_id: booking.service.id,
        stylist_id: booking.stylist.id,
        appointment_date: booking.date,
        appointment_time: booking.time,
        client_name: values.name.trim(),
        client_email: values.email.trim(),
        client_phone: values.phone.trim(),
        notes: values.notes.trim() || null,
      });
      onBooked();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div>
        <h2 className="text-4xl text-primary-900">Your details</h2>
        <p className="mt-3 text-sm text-primary-600">
          We will confirm your appointment by email within one business day.
        </p>
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Full name" htmlFor="booking-name" error={errors.name}>
            <input
              id="booking-name"
              autoComplete="name"
              className="field"
              value={values.name}
              onChange={updateField('name')}
              aria-invalid={Boolean(errors.name)}
            />
          </Field>
        </div>
        <Field label="Email" htmlFor="booking-email" error={errors.email}>
          <input
            id="booking-email"
            type="email"
            autoComplete="email"
            className="field"
            value={values.email}
            onChange={updateField('email')}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label="Phone" htmlFor="booking-phone" error={errors.phone}>
          <input
            id="booking-phone"
            type="tel"
            autoComplete="tel"
            className="field"
            value={values.phone}
            onChange={updateField('phone')}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Notes (optional)" htmlFor="booking-notes" error={errors.notes}>
            <textarea
              id="booking-notes"
              rows={4}
              placeholder="Allergies, skin concerns or anything we should know"
              className="field resize-none"
              value={values.notes}
              onChange={updateField('notes')}
              aria-invalid={Boolean(errors.notes)}
            />
          </Field>
        </div>
      </div>

      {serverError && (
        <p role="alert" className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
        {isSubmitting ? 'Booking...' : 'Request appointment'}
      </button>
    </form>
  );
}
