# Racket Tracker

Lightweight badminton racket stringing intake & tracking app. Now wired for Supabase.

## Environment Variables

Create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# Optionally for server-side privileged ops (do not expose this publicly)
SUPABASE_SERVICE_ROLE_KEY=service_role_key
STORE_ID=1
```

## Supabase Schema

Use the provided SQL (see `supabase-schema.sql`) to create tables. Add a convenience view for API aggregation:

```sql
create or replace view jobs_view as
select
  j.id,
  j.store_id,
  j.status,
  j.service_type,
  j.additional_notes,
  j.created_at,
  j.updated_at,
  c.full_name as customer_name,
  c.contact_number,
  c.email,
  r.brand as racket_brand,
  r.model as racket_model,
  r.string_type
from jobs j
join customers c on c.id = j.customer_id
left join rackets r on r.id = j.racket_id;
```

## API Routes

- `GET /api/orders?storeId=1` list
- `POST /api/orders` create (auto upserts customer + racket)
- `PATCH /api/orders/:id` update status/notes
- `DELETE /api/orders/:id` remove job

## Roadmap

- Auth (Supabase Auth, RLS policies)
- Realtime subscriptions (Supabase channel) to live-update dashboard
- Bulk status update endpoint
- Order tension + pricing fields
