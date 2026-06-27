/*
# Create profiles and usage_logs tables for Snaptoria

1. New Tables
- `profiles`: Stores user profile information linked to Supabase Auth
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, user email)
  - `plan` (text, default 'free' - can be 'free' or 'pro')
  - `created_at` (timestamp)
- `usage_logs`: Tracks when users use tools
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `tool_name` (text, name of the tool used)
  - `used_at` (timestamp)
- `chat_leads`: Captures chat interactions for follow-up
  - `id` (uuid, primary key)
  - `email` (text, optional user email)
  - `message` (text, the chat message)
  - `created_at` (timestamp)

2. Security
- Enable RLS on all tables
- Users can read/update their own profile
- Users can read their own usage logs
- Anyone can insert chat leads (for unauthenticated users)
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  plan text NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  used_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_leads ENABLE ROW LEVEL SECURITY;

-- Profiles policies (users can only access their own profile)
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Allow profile creation on signup via trigger or insert
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Usage logs policies (users can only see their own logs)
DROP POLICY IF EXISTS "select_own_usage_logs" ON usage_logs;
CREATE POLICY "select_own_usage_logs" ON usage_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_usage_logs" ON usage_logs;
CREATE POLICY "insert_own_usage_logs" ON usage_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Chat leads policies (anyone can insert for lead capture)
DROP POLICY IF EXISTS "insert_chat_leads" ON chat_leads;
CREATE POLICY "insert_chat_leads" ON chat_leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_tool_name ON usage_logs(tool_name);
CREATE INDEX IF NOT EXISTS idx_usage_logs_used_at ON usage_logs(used_at);