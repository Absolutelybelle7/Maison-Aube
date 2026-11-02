export function isValidEmail(value: string): boolean {
  return value.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^[+\d\s().-]+$/.test(value);
}
