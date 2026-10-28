-- One-time password reset links (only a SHA-256 hash of the token is stored).
CREATE TABLE IF NOT EXISTS password_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  requested_ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS password_resets_user_idx ON password_resets (user_id, created_at DESC);

-- Sessions issued before this moment are rejected (set when a password is reset).
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at timestamptz;
