-- Migration Part 2: Outreach and Communication Tables

-- Outreach messages table
CREATE TABLE outreach_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    opportunity_id UUID REFERENCES opportunities(id),
    message_type TEXT,
    message_subject TEXT,
    message_body TEXT,
    ai_generated BOOLEAN DEFAULT false,
    ai_prompt TEXT,
    owner_approved BOOLEAN DEFAULT false,
    owner_approved_at TIMESTAMPTZ,
    owner_notes TEXT,
    gmail_draft_id TEXT,
    gmail_sent_message_id TEXT,
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    reply_classification TEXT,
    follow_up_number INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Email threads table
CREATE TABLE email_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    gmail_thread_id TEXT NOT NULL,
    thread_subject TEXT,
    last_message_at TIMESTAMPTZ,
    last_message_preview TEXT,
    message_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    requires_response BOOLEAN DEFAULT false,
    ai_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id),
    opportunity_id UUID REFERENCES opportunities(id),
    application_type TEXT,
    application_status TEXT DEFAULT 'draft',
    date_submitted DATE,
    response_received_at TIMESTAMPTZ,
    response_type TEXT,
    response_notes TEXT,
    application_url TEXT,
    login_username TEXT,
    login_password_encrypted TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_outreach_company ON outreach_messages(company_id);
CREATE INDEX idx_outreach_sent ON outreach_messages(sent_at);
CREATE INDEX idx_threads_company ON email_threads(company_id);
CREATE INDEX idx_applications_company ON applications(company_id);

-- Enable RLS
ALTER TABLE outreach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all" ON outreach_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON email_threads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON applications FOR ALL USING (true) WITH CHECK (true);
