import { supabase } from '@/lib/supabase';
import type {
  BookedSlot,
  BookingRequest,
  ContactRequest,
  Service,
  Stylist,
} from '@/types/salon';

const LOAD_ERROR = 'We could not load this information. Please try again in a moment.';
const SAVE_ERROR = 'We could not send your request. Please check your details and try again.';

const SERVICE_COLUMNS = 'id, name, category, description, duration_minutes, price_cents, image_url, sort_order';
const STYLIST_COLUMNS = 'id, name, role, bio, image_url, sort_order';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number';
const isNullableString = (value: unknown): value is string | null =>
  value === null || isString(value);

function isService(row: unknown): row is Service {
  return (
    isRecord(row) &&
    isString(row.id) &&
    isString(row.name) &&
    isString(row.category) &&
    isString(row.description) &&
    isNumber(row.duration_minutes) &&
    isNumber(row.price_cents) &&
    isNullableString(row.image_url) &&
    isNumber(row.sort_order)
  );
}

function isStylist(row: unknown): row is Stylist {
  return (
    isRecord(row) &&
    isString(row.id) &&
    isString(row.name) &&
    isString(row.role) &&
    isString(row.bio) &&
    isNullableString(row.image_url) &&
    isNumber(row.sort_order)
  );
}

function isBookedSlot(row: unknown): row is BookedSlot {
  return isRecord(row) && isString(row.start_time) && isString(row.end_time);
}

function parseRows<T>(data: unknown, isRow: (row: unknown) => row is T): T[] {
  if (!Array.isArray(data) || !data.every(isRow)) {
    throw new Error(LOAD_ERROR);
  }
  return data;
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select(SERVICE_COLUMNS)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw new Error(LOAD_ERROR);
  return parseRows(data, isService);
}

export async function fetchStylists(): Promise<Stylist[]> {
  const { data, error } = await supabase
    .from('stylists')
    .select(STYLIST_COLUMNS)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw new Error(LOAD_ERROR);
  return parseRows(data, isStylist);
}

export async function fetchBookedSlots(day: string, stylistId: string): Promise<BookedSlot[]> {
  const { data, error } = await supabase.rpc('booked_slots', {
    p_day: day,
    p_stylist: stylistId,
  });
  if (error) throw new Error(LOAD_ERROR);
  return parseRows(data, isBookedSlot);
}

export async function createAppointment(request: BookingRequest): Promise<void> {
  const { error } = await supabase.from('appointments').insert(request);
  if (error) throw new Error(SAVE_ERROR);
}

export async function sendContactMessage(request: ContactRequest): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert(request);
  if (error) throw new Error(SAVE_ERROR);
}
