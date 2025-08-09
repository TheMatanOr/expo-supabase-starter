-- User Profiles Table
-- This table extends the built-in auth.users table with additional profile information
-- and stores onboarding data

CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT, -- Optional, will be populated from OAuth providers or asked later
    
    -- Onboarding data as separate columns for easy querying
    fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
    goals TEXT[] DEFAULT '{}', -- Array of goals: weight_loss, muscle_gain, endurance, flexibility, general_fitness
    workout_frequency TEXT CHECK (workout_frequency IN ('2-3_times', '4-5_times', '6-7_times')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_fitness_level ON user_profiles(fitness_level);
CREATE INDEX idx_user_profiles_goals ON user_profiles USING GIN (goals);
CREATE INDEX idx_user_profiles_workout_frequency ON user_profiles(workout_frequency);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Example queries for onboarding data:
-- Find users by fitness level:
-- SELECT * FROM user_profiles WHERE fitness_level = 'beginner';

-- Find users with specific goals:
-- SELECT * FROM user_profiles WHERE 'weight_loss' = ANY(goals);

-- Find users by workout frequency:
-- SELECT * FROM user_profiles WHERE workout_frequency = '4-5_times';

-- Get user's complete onboarding profile:
-- SELECT fitness_level, goals, workout_frequency FROM user_profiles WHERE id = 'user_id';

-- Grant necessary permissions (adjust based on your needs)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;
