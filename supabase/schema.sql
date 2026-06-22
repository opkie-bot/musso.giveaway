-- Musso Family Dentistry - Quarterly Giveaway Tracker
-- Run this SQL in your Supabase SQL Editor to set up the database schema

-- 1. Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    dob DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(full_name, dob)
);

-- 2. Giveaways Table
CREATE TABLE giveaways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Entries Table
CREATE TABLE entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    giveaway_id UUID REFERENCES giveaways(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL, -- 'facebook', 'instagram', 'review', 'referral'
    points_awarded INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for better query performance
CREATE INDEX idx_entries_patient_id ON entries(patient_id);
CREATE INDEX idx_entries_giveaway_id ON entries(giveaway_id);
CREATE INDEX idx_entries_action_type ON entries(action_type);
CREATE INDEX idx_giveaways_is_active ON giveaways(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaways ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Policies for anonymous access (via anon key)
-- Patients: allow insert and select
CREATE POLICY "Allow anonymous patient creation" ON patients
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous patient read" ON patients
    FOR SELECT TO anon USING (true);

-- Giveaways: allow select, insert, update (for admin operations via anon key)
CREATE POLICY "Allow anonymous giveaway read" ON giveaways
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous giveaway insert" ON giveaways
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous giveaway update" ON giveaways
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Entries: allow select and insert
CREATE POLICY "Allow anonymous entry creation" ON entries
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous entry read" ON entries
    FOR SELECT TO anon USING (true);
