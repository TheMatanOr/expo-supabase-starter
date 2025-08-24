-- Migration Script: Update Existing Database Schema for Vision App
-- This script modifies your existing tables instead of dropping them
-- Run this in your Supabase SQL Editor to migrate from the old fitness app schema to the new vision app schema

-- Step 1: Add new columns to existing user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS vision TEXT,
ADD COLUMN IF NOT EXISTS count_per_day TEXT;

-- Step 2: Add constraints to the new columns
ALTER TABLE user_profiles 
ADD CONSTRAINT check_gender CHECK (gender IN ('male', 'female', 'prefer_not_to_say')),
ADD CONSTRAINT check_count_per_day CHECK (count_per_day IN ('5', '10', '20'));

-- Step 3: Create new vision_readings table for tracking daily progress
CREATE TABLE IF NOT EXISTS vision_readings (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	date DATE NOT NULL,
	read_count INTEGER DEFAULT 0, -- How many times they read their vision today
	goal_count INTEGER NOT NULL, -- Their daily goal from onboarding
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	UNIQUE(user_id, date) -- One record per user per day
);

-- Step 4: Enable Row Level Security on vision_readings if not already enabled
ALTER TABLE vision_readings ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies for vision_readings (only if they don't exist)
DO $$
BEGIN
    -- Check if policy exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vision_readings' AND policyname = 'Users can view own vision readings') THEN
        CREATE POLICY "Users can view own vision readings" ON vision_readings
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vision_readings' AND policyname = 'Users can insert own vision readings') THEN
        CREATE POLICY "Users can insert own vision readings" ON vision_readings
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vision_readings' AND policyname = 'Users can update own vision readings') THEN
        CREATE POLICY "Users can update own vision readings" ON vision_readings
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Step 6: Create indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_user_profiles_gender ON user_profiles(gender);
CREATE INDEX IF NOT EXISTS idx_user_profiles_count_per_day ON user_profiles(count_per_day);
CREATE INDEX IF NOT EXISTS idx_vision_readings_user_id ON vision_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_vision_readings_date ON vision_readings(date);
CREATE INDEX IF NOT EXISTS idx_vision_readings_user_date ON vision_readings(user_id, date);

-- Step 7: Create function to update updated_at timestamp (only if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 8: Create triggers to automatically update updated_at (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at') THEN
        CREATE TRIGGER update_user_profiles_updated_at
            BEFORE UPDATE ON user_profiles
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vision_readings_updated_at') THEN
        CREATE TRIGGER update_vision_readings_updated_at
            BEFORE UPDATE ON vision_readings
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Step 9: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.vision_readings TO authenticated;
GRANT SELECT ON public.vision_readings TO anon;

-- Step 10: Verify the migration
DO $$
BEGIN
    RAISE NOTICE 'Migration completed! Verifying changes...';
    
    -- Check if new columns were added to user_profiles
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'vision') THEN
        RAISE NOTICE '✓ vision column added to user_profiles';
    ELSE
        RAISE NOTICE '✗ vision column not found in user_profiles';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'count_per_day') THEN
        RAISE NOTICE '✓ count_per_day column added to user_profiles';
    ELSE
        RAISE NOTICE '✗ count_per_day column not found in user_profiles';
    END IF;
    
    -- Check if vision_readings table was created
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vision_readings') THEN
        RAISE NOTICE '✓ vision_readings table created successfully';
    ELSE
        RAISE NOTICE '✗ vision_readings table creation failed';
    END IF;
    
    RAISE NOTICE 'Migration verification complete!';
END $$;

-- Migration completed successfully!
-- Your existing user_profiles table has been updated with new columns for the Vision App.
-- The new vision_readings table has been created for tracking daily progress.
