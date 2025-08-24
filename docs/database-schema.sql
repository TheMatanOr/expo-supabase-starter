-- User profiles table
CREATE TABLE user_profiles (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	email TEXT NOT NULL,
	full_name TEXT NOT NULL,
	gender TEXT CHECK (gender IN ('male', 'female',  'prefer_not_to_say')),
	vision TEXT NOT NULL, -- User's vision statement
	count_per_day TEXT CHECK (count_per_day IN ('5', '10', '20')), -- How many times per day to read vision
	onboarding_completed BOOLEAN DEFAULT FALSE,
	onboarding_data JSONB, -- Store complete onboarding data as JSON
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vision tracking table
CREATE TABLE vision_readings (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	date DATE NOT NULL,
	read_count INTEGER DEFAULT 0, -- How many times they read their vision today
	goal_count INTEGER NOT NULL, -- Their daily goal from onboarding
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	UNIQUE(user_id, date) -- One record per user per day
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_readings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
	FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
	FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
	FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for vision_readings
CREATE POLICY "Users can view own vision readings" ON vision_readings
	FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vision readings" ON vision_readings
	FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vision readings" ON vision_readings
	FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_gender ON user_profiles(gender);
CREATE INDEX idx_user_profiles_count_per_day ON user_profiles(count_per_day);

CREATE INDEX idx_vision_readings_user_id ON vision_readings(user_id);
CREATE INDEX idx_vision_readings_date ON vision_readings(date);
CREATE INDEX idx_vision_readings_user_date ON vision_readings(user_id, date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
	BEFORE UPDATE ON user_profiles
	FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vision_readings_updated_at
	BEFORE UPDATE ON vision_readings
	FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample queries for the vision tracking app:

-- Get user's profile with vision:
-- SELECT full_name, gender, vision, count_per_day FROM user_profiles WHERE id = 'user_id';

-- Get user's vision reading progress for today:
-- SELECT read_count, goal_count FROM vision_readings WHERE user_id = 'user_id' AND date = CURRENT_DATE;

-- Get user's vision reading progress for the last 7 days:
-- SELECT date, read_count, goal_count FROM vision_readings 
-- WHERE user_id = 'user_id' AND date >= CURRENT_DATE - INTERVAL '7 days'
-- ORDER BY date DESC;

-- Update today's reading count:
-- INSERT INTO vision_readings (user_id, date, read_count, goal_count)
-- VALUES ('user_id', CURRENT_DATE, 1, 10)
-- ON CONFLICT (user_id, date) 
-- DO UPDATE SET read_count = vision_readings.read_count + 1, updated_at = NOW();
