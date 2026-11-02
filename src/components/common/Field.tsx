import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export default function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs font-medium text-error-700">
          {error}
        </p>
      )}
    </div>
  );
}
