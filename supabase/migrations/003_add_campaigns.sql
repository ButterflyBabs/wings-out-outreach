-- Add campaigns table for outreach campaigns

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('email', 'dm', 'mixed')),
    status TEXT CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed')),
    target_count INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    response_count INTEGER DEFAULT 0,
    description TEXT,
    scheduled_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own campaigns"
    ON campaigns FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can create campaigns"
    ON campaigns FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own campaigns"
    ON campaigns FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own campaigns"
    ON campaigns FOR DELETE
    USING (auth.uid() = created_by);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
