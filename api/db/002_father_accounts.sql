ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin','publisher','editor','father'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS father_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile_number TEXT;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_father_profile_check;
ALTER TABLE users ADD CONSTRAINT users_father_profile_check CHECK (role <> 'father' OR (father_id IS NOT NULL AND date_of_birth IS NOT NULL AND mobile_number IS NOT NULL));
CREATE UNIQUE INDEX IF NOT EXISTS users_father_id_unique_idx ON users (lower(father_id)) WHERE father_id IS NOT NULL;
