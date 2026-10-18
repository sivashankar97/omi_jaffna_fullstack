CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','publisher','editor','father')) DEFAULT 'editor',
  father_id TEXT UNIQUE,
  date_of_birth DATE,
  mobile_number TEXT,
  CONSTRAINT users_father_profile_check CHECK (role <> 'father' OR (father_id IS NOT NULL AND date_of_birth IS NOT NULL AND mobile_number IS NOT NULL)),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('page','ministry','parish','formation','location','leadership','international','news','event','publication','media','school','timeline')),
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL DEFAULT '',
  title_si TEXT NOT NULL DEFAULT '',
  excerpt_en TEXT NOT NULL DEFAULT '',
  excerpt_ta TEXT NOT NULL DEFAULT '',
  excerpt_si TEXT NOT NULL DEFAULT '',
  body_en TEXT NOT NULL DEFAULT '',
  body_ta TEXT NOT NULL DEFAULT '',
  body_si TEXT NOT NULL DEFAULT '',
  location_text TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  media_url TEXT NOT NULL DEFAULT '',
  event_date TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('draft','review','published')) DEFAULT 'draft',
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending','verified')) DEFAULT 'pending',
  last_verified_at DATE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(type,slug)
);
CREATE INDEX IF NOT EXISTS content_type_status_idx ON content_items(type,status,sort_order);
CREATE INDEX IF NOT EXISTS content_search_idx ON content_items USING GIN (to_tsvector('simple', title_en || ' ' || excerpt_en));

CREATE TABLE IF NOT EXISTS people_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_title TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  location_id UUID REFERENCES content_items(id) ON DELETE SET NULL,
  approved_for_public BOOLEAN NOT NULL DEFAULT FALSE,
  last_verified_at DATE,
  notes_private TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  privacy_consent BOOLEAN NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('new','in_progress','closed')) DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries(status,created_at DESC);

CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','published')) DEFAULT 'draft',
  rights_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  alt_text TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
