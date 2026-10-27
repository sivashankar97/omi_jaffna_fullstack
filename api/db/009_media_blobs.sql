-- Store uploaded media bytes in Postgres (MEDIA_STORE=postgres).
CREATE TABLE IF NOT EXISTS media_blobs (
  filename text PRIMARY KEY,
  data bytea NOT NULL,
  byte_size integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS media_blobs_updated_at_idx ON media_blobs (updated_at DESC);
