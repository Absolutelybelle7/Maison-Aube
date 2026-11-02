import { useMemo } from 'react';
import { ErrorNotice, LoadingGrid } from '@/components/common/AsyncPlaceholders';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  addDays,
  buildDaySlots,
  earliestBookableMinutes,
  formatSlotLabel,
  toIsoDate,
} from '@/lib/bookingSlots';
import { fetchBookedSlots } from '@/lib/salonApi';

const DATE_WINDOW_DAYS = 14;

interface ScheduleStepProps {
  durationMinutes: number;
  stylistId: string;
  date: string | null;
  time: string | null;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export default function ScheduleStep({
  durationMinutes,
  stylistId,
  date,
  time,
  onDateChange,
  onTimeChange,
}: ScheduleStepProps) {
  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: DATE_WINDOW_DAYS }, (_, offset) => addDays(today, offset));
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-4xl text-primary-900">Choose a date</h2>
        <div className="-mx-6 mt-8 flex gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:px-0" role="group" aria-label="Dates">
          {dates.map((day) => {
            const iso = toIsoDate(day);
            const isSelected = iso === date;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onDateChange(iso)}
                aria-pressed={isSelected}
                className={`flex w-20 shrink-0 flex-col items-center rounded-2xl border py-4 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
                  isSelected
                    ? 'border-primary-900 bg-primary-900 text-secondary-50'
                    : 'border-primary-200 bg-white text-primary-800 hover:border-primary-500'
                }`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="mt-2 font-display text-3xl">{day.getDate()}</span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.1em] opacity-80">
                  {day.toLocaleDateString('en-US', { month: 'short' })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {date && (
        <SlotGrid
          date={date}
          stylistId={stylistId}
          durationMinutes={durationMinutes}
          selectedTime={time}
          onTimeChange={onTimeChange}
        />
      )}
    </div>
  );
}

interface SlotGridProps {
  date: string;
  stylistId: string;
  durationMinutes: number;
  selectedTime: string | null;
  onTimeChange: (time: string) => void;
}

function SlotGrid({ date, stylistId, durationMinutes, selectedTime, onTimeChange }: SlotGridProps) {
  const booked = useAsyncData(() => fetchBookedSlots(date, stylistId), [date, stylistId]);

  if (booked.status === 'loading') {
    return (
      <div>
        <h3 className="font-display text-2xl text-primary-900">Available times</h3>
        <div className="mt-6">
          <LoadingGrid count={8} columns="grid-cols-3 sm:grid-cols-4" aspectClass="aspect-[2/1]" />
        </div>
      </div>
    );
  }

  if (booked.status === 'error') return <ErrorNotice message={booked.error} />;

  const slots = buildDaySlots({
    durationMinutes,
    booked: booked.data,
    earliestMinutes: earliestBookableMinutes(date, new Date()),
  });
  const hasOpenSlot = slots.some((slot) => slot.available);

  return (
    <div>
      <h3 className="font-display text-2xl text-primary-900">Available times</h3>
      {!hasOpenSlot && (
        <p className="mt-4 text-sm text-primary-600">
          This specialist is fully booked on this day. Please choose another date.
        </p>
      )}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {slots.map((slot) => {
          const isSelected = slot.time === selectedTime;
          return (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              onClick={() => onTimeChange(slot.time)}
              aria-pressed={isSelected}
              className={`rounded-xl border px-3 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:cursor-not-allowed ${
                isSelected
                  ? 'border-primary-900 bg-primary-900 text-secondary-50'
                  : slot.available
                    ? 'border-primary-200 bg-white text-primary-800 hover:border-primary-900'
                    : 'border-primary-100 bg-primary-50 text-primary-400 line-through'
              }`}
            >
              {formatSlotLabel(slot.time)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
