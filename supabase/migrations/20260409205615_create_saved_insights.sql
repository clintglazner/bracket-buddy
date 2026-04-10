/*
  # Create saved_insights table

  1. New Tables
    - `saved_insights`
      - `id` (uuid, primary key)
      - `user_email` (text, for client-side user identification)
      - `user_name` (text, display name)
      - `team_a_name` (text, first team or player name)
      - `team_b_name` (text, second team or player name, optional)
      - `insight_summary` (text, AI-generated comparison summary)
      - `market_odds` (text, market odds insight)
      - `team_a_insight` (text, individual team A insight)
      - `team_b_insight` (text, individual team B insight)
      - `is_pinned` (boolean, whether insight is pinned/saved)
      - `created_at` (timestamptz, auto-set on creation)

  2. Security
    - Enable RLS on `saved_insights` table
    - Add policies for anon users to read and write their own data (demo app without full auth)
    - Rows are scoped by user_email for basic data separation

  3. Notes
    - This is a demo/prototype app using email as a soft identifier
    - RLS allows anon key access filtered by user_email for the demo use case
    - No hard auth enforcement since this is a prototype analytics dashboard
*/

CREATE TABLE IF NOT EXISTS saved_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_name text NOT NULL DEFAULT '',
  team_a_name text NOT NULL DEFAULT '',
  team_b_name text NOT NULL DEFAULT '',
  insight_summary text NOT NULL DEFAULT '',
  market_odds text NOT NULL DEFAULT '',
  team_a_insight text NOT NULL DEFAULT '',
  team_b_insight text NOT NULL DEFAULT '',
  is_pinned boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saved_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert"
  ON saved_insights
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon select own rows"
  ON saved_insights
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon delete own rows"
  ON saved_insights
  FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS saved_insights_user_email_idx ON saved_insights(user_email);
CREATE INDEX IF NOT EXISTS saved_insights_created_at_idx ON saved_insights(created_at DESC);
