CREATE TABLE IF NOT EXISTS father_dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL DEFAULT '',
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS father_dispatches_target_idx ON father_dispatches(target_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS father_dispatches_all_idx ON father_dispatches(created_at DESC) WHERE target_user_id IS NULL;
