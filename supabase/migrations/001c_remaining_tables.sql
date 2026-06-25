-- Migration Part 3: Remaining Tables

-- Partnership assets table
CREATE TABLE partnership_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_type TEXT NOT NULL,
    asset_name TEXT,
    asset_description TEXT,
    file_url TEXT,
    file_size_bytes INTEGER,
    content_text TEXT,
    version_number INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    usage_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partnership agreements table
CREATE TABLE partnership_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id),
    agreement_type TEXT,
    agreement_status TEXT DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    compensation_type TEXT,
    compensation_amount TEXT,
    payment_terms TEXT,
    exclusivity_terms TEXT,
    content_requirements TEXT,
    usage_rights TEXT,
    contract_url TEXT,
    signed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliverables table
CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id UUID NOT NULL REFERENCES partnership_agreements(id) ON DELETE CASCADE,
    deliverable_type TEXT,
    deliverable_title TEXT,
    description TEXT,
    due_date DATE,
    completed_date DATE,
    status TEXT DEFAULT 'pending',
    content_url TEXT,
    platform_posted TEXT,
    performance_metrics JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate links table
CREATE TABLE affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id),
    agreement_id UUID REFERENCES partnership_agreements(id),
    link_url TEXT NOT NULL,
    link_code TEXT,
    link_name TEXT,
    platform TEXT,
    discount_code TEXT,
    created_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue table
CREATE TABLE revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    agreement_id UUID REFERENCES partnership_agreements(id),
    deliverable_id UUID REFERENCES deliverables(id),
    revenue_type TEXT,
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    date_earned DATE,
    date_paid DATE,
    payment_method TEXT,
    payment_reference TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id),
    task_type TEXT,
    task_title TEXT NOT NULL,
    task_description TEXT,
    priority TEXT DEFAULT 'medium',
    due_date DATE,
    recurrence_rule TEXT,
    status TEXT DEFAULT 'pending',
    assigned_to UUID REFERENCES auth.users(id),
    automated BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Suppression list table
CREATE TABLE suppression_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_domain TEXT,
    email_address TEXT,
    company_id UUID REFERENCES companies(id),
    reason TEXT,
    source TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at DATE,
    notes TEXT
);

-- Create indexes
CREATE INDEX idx_assets_type ON partnership_assets(asset_type);
CREATE INDEX idx_agreements_company ON partnership_agreements(company_id);
CREATE INDEX idx_deliverables_agreement ON deliverables(agreement_id);
CREATE INDEX idx_affiliate_company ON affiliate_links(company_id);
CREATE INDEX idx_revenue_company ON revenue(company_id);
CREATE INDEX idx_tasks_company ON tasks(company_id);
CREATE INDEX idx_tasks_due ON tasks(due_date);
CREATE INDEX idx_suppression_email ON suppression_list(email_address);

-- Enable RLS
ALTER TABLE partnership_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppression_list ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all" ON partnership_assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON partnership_agreements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON deliverables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON affiliate_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON revenue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON suppression_list FOR ALL USING (true) WITH CHECK (true);
