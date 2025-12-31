-- Component bookmarks table
-- Allows users to bookmark components for later (separate from adding to toolkit)

CREATE TABLE IF NOT EXISTS user_component_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, component_id)
);

-- Index for fast lookups
CREATE INDEX idx_component_bookmarks_user ON user_component_bookmarks(user_id);
CREATE INDEX idx_component_bookmarks_component ON user_component_bookmarks(component_id);

-- RLS policies
ALTER TABLE user_component_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON user_component_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON user_component_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON user_component_bookmarks FOR DELETE
  USING (auth.uid() = user_id);
