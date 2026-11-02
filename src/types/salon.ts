export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  image_url: string | null;
  sort_order: number;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string | null;
  sort_order: number;
}

export interface BookedSlot {
  start_time: string;
  end_time: string;
}

export interface BookingRequest {
  service_id: string;
  stylist_id: string;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  notes: string | null;
}

export interface BookingDraft {
  service: Service | null;
  stylist: Stylist | null;
  date: string | null;
  time: string | null;
}

export interface CompleteBooking {
  service: Service;
  stylist: Stylist;
  date: string;
  time: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}
