/*
# Create salon schema: services, stylists, appointments, contact messages

Plain-English summary
This migration sets up everything the salon website needs to store data. Visitors can browse
services and stylists, request appointments, and send messages. Visitors cannot read other
people's bookings or messages.

1. New Tables
- `services`: treatments shown on the site (name, category, description, duration, price, image).
- `stylists`: team members shown on the team page (name, role, bio, portrait).
- `appointments`: booking requests submitted from the booking page. Status starts as "requested".
- `contact_messages`: messages submitted from the contact page.

2. New Function
- `booked_slots(p_day, p_stylist)`: returns only the start and end times of non-cancelled
  appointments for one stylist on one day, so the booking page can hide taken times without
  exposing client details.

3. Security
- Row level security is enabled on every new table.
- Anonymous visitors can read active services and active stylists only.
- Anonymous visitors can insert appointments, but only into the listed booking columns. They
  cannot set the status themselves.
- Anonymous visitors can insert contact messages. They cannot read either table back.
- `booked_slots` is callable by anonymous visitors and returns no personal data.

4. Seed Data
- Demo services and stylists are inserted once. Re-running this migration does not duplicate them.

5. Important Notes
- No data is dropped or modified.
- Times are stored as local salon time (New York), so no timezone conversion is needed.
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stylists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id),
  stylist_id uuid NOT NULL REFERENCES stylists(id),
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  client_name text NOT NULL CHECK (char_length(client_name) BETWEEN 1 AND 100),
  client_email text NOT NULL CHECK (char_length(client_email) BETWEEN 5 AND 200 AND client_email LIKE '%_@_%'),
  client_phone text NOT NULL CHECK (char_length(client_phone) BETWEEN 7 AND 30),
  notes text CHECK (notes IS NULL OR char_length(notes) <= 1000),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS appointments_stylist_date_idx ON appointments (stylist_id, appointment_date);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 200 AND email LIKE '%_@_%'),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON services TO anon, authenticated;
GRANT SELECT ON stylists TO anon, authenticated;
GRANT INSERT (service_id, stylist_id, appointment_date, appointment_time, client_name, client_email, client_phone, notes) ON appointments TO anon, authenticated;
GRANT INSERT (name, email, message) ON contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "public_select_active_services" ON services;
CREATE POLICY "public_select_active_services" ON services FOR SELECT
  TO anon, authenticated USING (is_active);

DROP POLICY IF EXISTS "public_select_active_stylists" ON stylists;
CREATE POLICY "public_select_active_stylists" ON stylists FOR SELECT
  TO anon, authenticated USING (is_active);

DROP POLICY IF EXISTS "public_insert_appointments" ON appointments;
CREATE POLICY "public_insert_appointments" ON appointments FOR INSERT
  TO anon, authenticated WITH CHECK (status = 'requested');

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.booked_slots(p_day date, p_stylist uuid)
RETURNS TABLE (start_time time, end_time time)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.appointment_time,
         (a.appointment_time + make_interval(mins => s.duration_minutes))::time
  FROM appointments a
  JOIN services s ON s.id = a.service_id
  WHERE a.stylist_id = p_stylist
    AND a.appointment_date = p_day
    AND a.status <> 'cancelled';
$$;

REVOKE EXECUTE ON FUNCTION public.booked_slots(date, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.booked_slots(date, uuid) TO anon, authenticated;

INSERT INTO services (name, category, description, duration_minutes, price_cents, image_url, sort_order)
SELECT v.name, v.category, v.description, v.duration_minutes, v.price_cents, v.image_url, v.sort_order
FROM (VALUES
  ('Quick Head Spa', 'Head Spa', 'A 35-minute reset with deep cleansing, a soothing scalp massage and a full refresh of the scalp.', 35, 9000, 'https://images.pexels.com/photos/6186740/pexels-photo-6186740.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
  ('Signature Head Spa', 'Head Spa', 'Our signature scalp ritual with certified botanical oils, circulation work and a restorative neck and shoulder massage.', 60, 15000, 'https://images.pexels.com/photos/6629612/pexels-photo-6629612.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2),
  ('Haircut and Blow-Dry', 'Hair', 'A precision cut shaped around your face and hair texture, finished with a soft, polished blow-dry.', 60, 12000, 'https://images.pexels.com/photos/3993443/pexels-photo-3993443.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3),
  ('Balayage and Gloss', 'Hair', 'Hand-painted dimension for a natural, sun-kissed finish, sealed with a glossing treatment.', 150, 28000, 'https://images.pexels.com/photos/3993453/pexels-photo-3993453.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4),
  ('Luminous Facial', 'Facial', 'A 60-minute facial with cleansing, exfoliation, a sculpting massage and a hydrating mask for radiant skin.', 60, 16500, 'https://images.pexels.com/photos/37229301/pexels-photo-37229301.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 5),
  ('Hydrating Ritual Facial', 'Facial', 'A gentle 45-minute treatment that restores moisture and calm to tired or sensitive skin.', 45, 14000, 'https://images.pexels.com/photos/37229309/pexels-photo-37229309.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 6),
  ('Gel Manicure', 'Nails', 'Long-wear gel polish with cuticle care, shaping and a hand massage, finished in a quiet, natural tone.', 45, 6500, 'https://images.pexels.com/photos/7321715/pexels-photo-7321715.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 7),
  ('Hot Stone Massage', 'Massage', 'A full-body massage with warmed basalt stones and aromatherapy oils to release tension.', 60, 17500, 'https://images.pexels.com/photos/6187652/pexels-photo-6187652.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 8)
) AS v(name, category, description, duration_minutes, price_cents, image_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM services);

INSERT INTO stylists (name, role, bio, image_url, sort_order)
SELECT v.name, v.role, v.bio, v.image_url, v.sort_order
FROM (VALUES
  ('Aiko Mori', 'Founder and Master Hair Diagnostician', 'Trained in Tokyo''s luxury salons, Aiko leads every scalp and hair consultation with a patient, precise eye.', 'https://images.pexels.com/photos/9154947/pexels-photo-9154947.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
  ('Lea Duval', 'Senior Esthetician', 'Lea brings a Parisian approach to skin, blending gentle clinical knowledge with slow, sculpting massage.', 'https://images.pexels.com/photos/4450500/pexels-photo-4450500.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2),
  ('Hana Sato', 'Colorist and Stylist', 'Hana paints soft, luminous color and cuts with a clean line, designed to grow out beautifully.', 'https://images.pexels.com/photos/11187375/pexels-photo-11187375.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3)
) AS v(name, role, bio, image_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM stylists);
