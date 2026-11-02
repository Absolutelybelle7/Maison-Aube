import type { BookedSlot } from '@/types/salon';

const OPENING_MINUTES = 10 * 60;
const CLOSING_MINUTES = 20 * 60;
const SLOT_STEP_MINUTES = 30;
const MIN_LEAD_MINUTES = 60;

export interface DaySlot {
  time: string;
  label: string;
  available: boolean;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function toTimeValue(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatSlotLabel(time: string): string {
  const totalMinutes = toMinutes(time);
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function earliestBookableMinutes(day: string, now: Date): number {
  if (day !== toIsoDate(now)) return 0;
  return now.getHours() * 60 + now.getMinutes() + MIN_LEAD_MINUTES;
}

export function buildDaySlots(options: {
  durationMinutes: number;
  booked: BookedSlot[];
  earliestMinutes: number;
}): DaySlot[] {
  const { durationMinutes, booked, earliestMinutes } = options;
  const slots: DaySlot[] = [];

  for (
    let start = OPENING_MINUTES;
    start + durationMinutes <= CLOSING_MINUTES;
    start += SLOT_STEP_MINUTES
  ) {
    const end = start + durationMinutes;
    const overlapsBooking = booked.some(
      (slot) => start < toMinutes(slot.end_time) && toMinutes(slot.start_time) < end,
    );
    const isTooSoon = start < earliestMinutes;
    const time = toTimeValue(start);
    slots.push({
      time,
      label: formatSlotLabel(time),
      available: !overlapsBooking && !isTooSoon,
    });
  }

  return slots;
}
