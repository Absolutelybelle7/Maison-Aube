/*
# Tighten table privileges for the salon site

Plain-English summary
The database gave the public web role full read, write and delete rights on every salon table by
default. Row level security already blocked most of that, but the extra rights were unnecessary.
This migration removes them and grants only what the website uses.

1. Modified Access
- Removed all table-level rights from the anonymous and signed-in web roles on the four salon tables.
- Re-granted read access to active services and stylists only.
- Re-granted insert access to appointments, limited to the booking columns.
- Re-granted insert access to contact messages, limited to name, email and message.

2. Security
- Visitors still cannot read client bookings or contact messages.
- Visitors still cannot change or delete any record.

3. Important Notes
- No data is changed, dropped or moved.
- Row level security policies are unchanged.
*/

REVOKE ALL ON services, stylists, appointments, contact_messages FROM anon, authenticated;

GRANT SELECT ON services TO anon, authenticated;
GRANT SELECT ON stylists TO anon, authenticated;
GRANT INSERT (service_id, stylist_id, appointment_date, appointment_time, client_name, client_email, client_phone, notes) ON appointments TO anon, authenticated;
GRANT INSERT (name, email, message) ON contact_messages TO anon, authenticated;
