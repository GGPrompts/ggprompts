-- Prompt Likes Table
-- Tracks which users have liked which prompts

CREATE TABLE IF NOT EXISTS prompt_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(prompt_id, user_id)
);

-- Prompt Bookmarks Table
-- Tracks which users have bookmarked which prompts

CREATE TABLE IF NOT EXISTS prompt_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(prompt_id, user_id)
);

-- Enable RLS
ALTER TABLE prompt_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prompt_likes

-- Anyone can view likes (for counting)
CREATE POLICY "Anyone can view prompt likes" ON prompt_likes
  FOR SELECT USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Users can like prompts" ON prompt_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can unlike prompts" ON prompt_likes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for prompt_bookmarks

-- Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks" ON prompt_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can insert their own bookmarks
CREATE POLICY "Users can bookmark prompts" ON prompt_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can remove bookmarks" ON prompt_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompt_likes_prompt_id ON prompt_likes(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_likes_user_id ON prompt_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_bookmarks_prompt_id ON prompt_bookmarks(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_bookmarks_user_id ON prompt_bookmarks(user_id);
