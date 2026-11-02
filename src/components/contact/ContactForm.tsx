import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Field from '@/components/common/Field';
import { sendContactMessage } from '@/lib/salonApi';
import { isValidEmail } from '@/lib/validation';
import type { ContactRequest } from '@/types/salon';

type ContactValues = ContactRequest;
type ContactErrors = Partial<Record<keyof ContactValues, string>>;
type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY_VALUES: ContactValues = { name: '', email: '', message: '' };

function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.name.trim()) errors.name = 'Please tell us your name.';
  else if (values.name.trim().length > 100) errors.name = 'Please keep your name under 100 characters.';
  if (!isValidEmail(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!values.message.trim()) errors.message = 'Please write a short message.';
  else if (values.message.trim().length > 2000) errors.message = 'Please keep your message under 2,000 characters.';
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const updateField = (field: keyof ContactValues) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitState('sending');
    setServerError(null);
    try {
      await sendContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });
      setValues(EMPTY_VALUES);
      setSubmitState('sent');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitState('error');
    }
  };

  if (submitState === 'sent') {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-6 rounded-3xl bg-white p-10 shadow-[0_24px_60px_-30px_rgba(31,27,24,0.25)] lg:p-14">
        <CheckCircle2 className="h-12 w-12 text-success-700" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="text-4xl text-primary-900">Thank you for reaching out.</h2>
        <p className="text-sm leading-relaxed text-primary-600">
          Your message is with our team. We aim to reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => setSubmitState('idle')}
          className="link-underline text-sm font-semibold text-primary-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  const isSending = submitState === 'sending';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-7 rounded-3xl bg-white p-8 shadow-[0_24px_60px_-30px_rgba(31,27,24,0.25)] lg:p-12"
    >
      <div>
        <h2 className="text-4xl text-primary-900">Send us a message</h2>
        <p className="mt-3 text-sm text-primary-600">
          Questions about a treatment, a gift card or your skin and hair? Write to us here.
        </p>
      </div>

      <Field label="Name" htmlFor="contact-name" error={errors.name}>
        <input
          id="contact-name"
          autoComplete="name"
          className="field"
          value={values.name}
          onChange={updateField('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
        />
      </Field>

      <Field label="Email" htmlFor="contact-email" error={errors.email}>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          className="field"
          value={values.email}
          onChange={updateField('email')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
      </Field>

      <Field label="Message" htmlFor="contact-message" error={errors.message}>
        <textarea
          id="contact-message"
          rows={6}
          className="field resize-none"
          value={values.message}
          onChange={updateField('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
      </Field>

      {serverError && (
        <p role="alert" className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSending} className="btn-primary w-full sm:w-auto">
        {isSending ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}
