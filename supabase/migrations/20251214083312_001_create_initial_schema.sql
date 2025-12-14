/*
  # Sweet Shop Management System - Initial Schema

  1. New Tables
    - `profiles` - User profiles linked to Supabase auth
      - `id` (uuid, primary key, linked to auth.users)
      - `email` (text, unique)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamp)

    - `sweets` - Sweet products catalog
      - `id` (uuid, primary key)
      - `name` (text, unique, required)
      - `category` (text, required)
      - `price` (numeric, required)
      - `quantity` (integer, default 0)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `purchases` - Purchase history
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `sweet_id` (uuid, foreign key to sweets)
      - `quantity` (integer)
      - `total_price` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can read all sweets
    - Users can only read their own profile
    - Users can only view their own purchases
    - Only admins can add/update/delete sweets
    - Only admins can restock sweets

  3. Indexes
    - Index on sweets.name for search performance
    - Index on sweets.category for filtering
    - Index on purchases.user_id for user queries
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_profiles_auth FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sweets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  quantity integer DEFAULT 0 CHECK (quantity >= 0),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  sweet_id uuid NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_purchases_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_purchases_sweet FOREIGN KEY (sweet_id) REFERENCES sweets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sweets_name ON sweets(name);
CREATE INDEX IF NOT EXISTS idx_sweets_category ON sweets(category);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_sweet_id ON purchases(sweet_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Sweets are viewable by everyone"
  ON sweets FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert sweets"
  ON sweets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can update sweets"
  ON sweets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can delete sweets"
  ON sweets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
