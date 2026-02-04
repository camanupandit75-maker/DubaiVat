-- Create individual_profiles table
CREATE TABLE IF NOT EXISTS individual_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name text NOT NULL,
  email text,
  residency_status text CHECK (residency_status IN ('resident', 'tourist', 'visitor')),
  nationality text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE individual_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own profile" 
  ON individual_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
  ON individual_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
  ON individual_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_individual_profiles_user_id ON individual_profiles(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_individual_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_individual_profiles_updated_at
  BEFORE UPDATE ON individual_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_individual_profiles_updated_at();


