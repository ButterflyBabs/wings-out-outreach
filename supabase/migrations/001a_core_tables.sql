-- Migration Part 1: Core Tables (Companies, Contacts, Programs, Opportunities)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    website_url TEXT,
    category TEXT,
    subcategory TEXT,
    headquarters_location TEXT,
    country TEXT,
    company_size_estimate TEXT,
    brand_summary TEXT,
    accessibility_relevance INTEGER CHECK (accessibility_relevance >= 0 AND accessibility_relevance <= 10),
    service_dog_relevance INTEGER CHECK (service_dog_relevance >= 0 AND service_dog_relevance <= 10),
    products_summary TEXT,
    active_status BOOLEAN DEFAULT true,
    priority_level TEXT CHECK (priority_level IN ('A', 'B', 'C', 'D')),
    source_url TEXT,
    date_discovered DATE DEFAULT CURRENT_DATE,
    date_last_verified DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    title TEXT,
    department TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    contact_form_url TEXT,
    preferred_contact_method TEXT,
    verified_status BOOLEAN DEFAULT false,
    verification_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Programs table
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    program_name TEXT,
    program_type TEXT,
    commission_structure TEXT,
    application_url TEXT,
    program_status TEXT DEFAULT 'active',
    date_discovered DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id),
    opportunity_title TEXT,
    opportunity_stage TEXT DEFAULT 'research',
    fit_score INTEGER,
    revenue_score INTEGER,
    accessibility_score INTEGER,
    service_dog_score INTEGER,
    brand_alignment_score INTEGER,
    response_probability_score INTEGER,
    relationship_value_score INTEGER,
    overall_priority_score INTEGER,
    personalized_pitch_angle TEXT,
    proposed_content_concept TEXT,
    requested_compensation TEXT,
    minimum_acceptable_compensation TEXT,
    next_action TEXT,
    next_action_date DATE,
    assigned_to UUID REFERENCES auth.users(id),
    loss_reason TEXT,
    won_date DATE,
    lost_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_programs_company ON programs(company_id);
CREATE INDEX idx_opportunities_company ON opportunities(company_id);
CREATE INDEX idx_opportunities_stage ON opportunities(opportunity_stage);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all" ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON opportunities FOR ALL USING (true) WITH CHECK (true);
