-- =============================================
-- FIX ROW LEVEL SECURITY FOR business_profiles TABLE
-- =============================================
-- Run this SQL in Supabase SQL Editor to fix the RLS error

-- Enable RLS on business_profiles table (if not already enabled)
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own business profile" ON business_profiles;
DROP POLICY IF EXISTS "Users can insert their own business profile" ON business_profiles;
DROP POLICY IF EXISTS "Users can update their own business profile" ON business_profiles;
DROP POLICY IF EXISTS "Users can delete their own business profile" ON business_profiles;

-- Create policies for authenticated users
-- Users can view their own business profile
CREATE POLICY "Users can view their own business profile" 
ON business_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own business profile
CREATE POLICY "Users can insert their own business profile" 
ON business_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own business profile
CREATE POLICY "Users can update their own business profile" 
ON business_profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own business profile
CREATE POLICY "Users can delete their own business profile" 
ON business_profiles 
FOR DELETE 
USING (auth.uid() = user_id);





