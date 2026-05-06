CREATE TABLE spotify_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  archetype        TEXT NOT NULL,
  alter_ego        TEXT NOT NULL,
  dimensions       JSONB NOT NULL,
  top_genres       TEXT[] NOT NULL,
  archetype_scores JSONB NOT NULL,
  spotify_username TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE spotify_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own" ON spotify_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own" ON spotify_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own" ON spotify_profiles
  FOR UPDATE USING (auth.uid() = user_id);
