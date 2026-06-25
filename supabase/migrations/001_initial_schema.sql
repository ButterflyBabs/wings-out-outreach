-- Wings Out Outreach - Initial Database Schema
-- Phase 1: Foundation

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. COMPANIES TABLE
-- ============================================
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

-- Company categories enum
CREATE TYPE company_category AS ENUM (
    'mobility_equipment',
    'wheelchairs_scooters',
    'accessible_vehicles',
    'adaptive_clothing',
    'home_accessibility',
    'assistive_technology',
    'digital_accessibility',
    'accessible_travel',
    'service_dog_equipment',
    'dog_food_treats',
    'dog_accessories',
    'health_wellness',
    'caregiver_support',
    'accessibility_media',
    'disability_employment',
    'other'
);

-- ============================================
-- 2. CONTACTS TABLE
-- ============================================
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

-- Contact departments enum
CREATE TYPE contact_department AS ENUM (
    'affiliate',
    'ambassador',
    'creator_partnerships',
    'influencer_marketing',
    'public_relations',
    'media',
    'accessibility',
    'community_partnerships',
    'business_development',
    'customer_service',
    'founder_executive',
    'other'
);

-- ============================================
-- 3. PROGRAMS TABLE
-- ============================================
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    program_name TEXT,
    program_type TEXT,
    application_url TEXT,
    public_or_invite_only TEXT CHECK (public_or_invite_only IN ('public', 'invite_only')),
    commission_rate DECIMAL(5,2),
    commission_type TEXT,
    cookie_duration_days INTEGER,
    recurring_commission BOOLEAN DEFAULT false,
    flat_fee_available BOOLEAN DEFAULT false,
    gifted_product_available BOOLEAN DEFAULT false,
    paid_content_available BOOLEAN DEFAULT false,
    referral_bonus TEXT,
    minimum_payout DECIMAL(10,2),
    payment_method TEXT,
    payment_schedule TEXT,
    geographic_restrictions TEXT,
    follower_requirement TEXT,
    exclusivity_requirement TEXT,
    active_status BOOLEAN DEFAULT true,
    terms_url TEXT,
    date_last_verified DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Program types enum
CREATE TYPE program_type AS ENUM (
    'ambassador',
    'affiliate',
    'creator',
    'referral',
    'influencer',
    'user_generated_content',
    'accessibility_advisor',
    'product_tester',
    'speaker_event_partner',
    'brand_partnership',
    'research_panel',
    'other'
);

-- ============================================
-- 4. OPPORTUNITIES TABLE
-- ============================================
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    opportunity_title TEXT,
    opportunity_stage TEXT DEFAULT 'discovered',
    fit_score INTEGER CHECK (fit_score >= 0 AND fit_score <= 100),
    revenue_score INTEGER CHECK (revenue_score >= 0 AND revenue_score <= 100),
    accessibility_score INTEGER CHECK (accessibility_score >= 0 AND accessibility_score <= 100),
    service_dog_score INTEGER CHECK (service_dog_score >= 0 AND service_dog_score <= 100),
    brand_alignment_score INTEGER CHECK (brand_alignment_score >= 0 AND brand_alignment_score <= 100),
    response_probability_score INTEGER CHECK (response_probability_score >= 0 AND response_probability_score <= 100),
    relationship_value_score INTEGER CHECK (relationship_value_score >= 0 AND relationship_value_score <= 100),
    overall_priority_score INTEGER CHECK (overall_priority_score >= 0 AND overall_priority_score <= 100),
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

-- Opportunity stages enum
CREATE TYPE opportunity_stage AS ENUM (
    'discovered',
    'researching',
    'qualified',
    'contact_needed',
    'draft_ready',
    'awaiting_approval',
    'approved',
    'sent',
    'follow_up_1_due',
    'follow_up_2_due',
    'replied',
    'application_requested',
    'application_submitted',
    'media_kit_requested',
    'product_discussion',
    'paid_campaign_discussion',
    'negotiating',
    'contract_review',
    'partnership_won',
    'partnership_active',
    'partnership_completed',
    'declined',
    'not_a_fit',
    'no_response',
    'paused'
);

-- ============================================
-- 5. OUTREACH MESSAGES TABLE
-- ============================================
CREATE TABLE outreach_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    message_type TEXT,
    subject TEXT,
    body TEXT,
    personalization_notes TEXT,
    approval_status TEXT DEFAULT 'not_drafted',
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    gmail_draft_id TEXT,
    gmail_message_id TEXT,
    sent_at TIMESTAMPTZ,
    reply_received BOOLEAN DEFAULT false,
    follow_up_number INTEGER DEFAULT 0,
    scheduled_send_date DATE,
    compliance_checked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Message types enum
CREATE TYPE message_type AS ENUM (
    'initial_outreach',
    'follow_up_1',
    'follow_up_2',
    'application_response',
    'media_kit_response',
    'pricing_response',
    'product_receipt_confirmation',
    'campaign_proposal',
    'negotiation',
    'thank_you',
    'decline',
    'other'
);

-- Approval statuses enum
CREATE TYPE approval_status AS ENUM (
    'not_drafted',
    'drafted',
    'needs_revision',
    'ready_for_review',
    'approved',
    'sent',
    'cancelled'
);

-- ============================================
-- 6. EMAIL THREADS TABLE
-- ============================================
CREATE TABLE email_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    gmail_thread_id TEXT NOT NULL,
    latest_message_date TIMESTAMPTZ,
    latest_sender TEXT,
    latest_subject TEXT,
    thread_summary TEXT,
    reply_classification TEXT,
    sentiment TEXT,
    action_required BOOLEAN DEFAULT false,
    next_action TEXT,
    next_action_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reply classifications enum
CREATE TYPE reply_classification AS ENUM (
    'interested',
    'needs_more_information',
    'application_requested',
    'media_kit_requested',
    'rate_requested',
    'product_only_offer',
    'affiliate_only_offer',
    'paid_campaign_possibility',
    'meeting_requested',
    'follow_up_later',
    'declined',
    'opt_out',
    'out_of_office',
    'wrong_contact',
    'no_decision',
    'other'
);

-- ============================================
-- 7. APPLICATIONS TABLE
-- ============================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    application_url TEXT,
    application_started_date DATE,
    application_submitted_date DATE,
    application_status TEXT DEFAULT 'not_started',
    login_email TEXT,
    username TEXT,
    required_assets TEXT[],
    missing_assets TEXT[],
    decision_date DATE,
    decision TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Application statuses enum
CREATE TYPE application_status AS ENUM (
    'not_started',
    'in_progress',
    'waiting_on_information',
    'ready_to_submit',
    'submitted',
    'approved',
    'declined',
    'waitlisted',
    'more_information_requested'
);

-- ============================================
-- 8. PARTNERSHIP ASSETS TABLE
-- ============================================
CREATE TABLE partnership_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_type TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    file_url TEXT,
    public_url TEXT,
    current_version TEXT,
    approved_for_use BOOLEAN DEFAULT false,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Asset types enum
CREATE TYPE asset_type AS ENUM (
    'short_bio',
    'long_bio',
    'headshot',
    'beau_photo',
    'babs_and_beau_photo',
    'speaker_reel',
    'media_kit',
    'rate_card',
    'social_statistics',
    'newsletter_statistics',
    'case_study',
    'sample_product_review',
    'service_dog_task_summary',
    'accessibility_credentials',
    'books_publications',
    'press_coverage',
    'testimonials',
    'brand_logos',
    'email_signature',
    'other'
);

-- ============================================
-- 9. PARTNERSHIP AGREEMENTS TABLE
-- ============================================
CREATE TABLE partnership_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    agreement_type TEXT,
    start_date DATE,
    end_date DATE,
    compensation_amount DECIMAL(10,2),
    commission_rate DECIMAL(5,2),
    payment_terms TEXT,
    exclusivity_terms TEXT,
    content_deliverables TEXT,
    usage_rights TEXT,
    licensing_terms TEXT,
    revision_limit INTEGER,
    cancellation_terms TEXT,
    product_value DECIMAL(10,2),
    contract_file_url TEXT,
    contract_status TEXT DEFAULT 'draft',
    legal_review_needed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Contract statuses enum
CREATE TYPE contract_status AS ENUM (
    'draft',
    'under_review',
    'changes_requested',
    'approved',
    'signed',
    'active',
    'completed',
    'cancelled'
);

-- ============================================
-- 10. DELIVERABLES TABLE
-- ============================================
CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partnership_agreement_id UUID REFERENCES partnership_agreements(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    deliverable_type TEXT,
    title TEXT,
    platform TEXT,
    due_date DATE,
    draft_date DATE,
    approval_due_date DATE,
    publish_date DATE,
    status TEXT DEFAULT 'not_started',
    content_url TEXT,
    brand_approval_required BOOLEAN DEFAULT true,
    brand_approval_status TEXT,
    revision_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliverable statuses enum
CREATE TYPE deliverable_status AS ENUM (
    'not_started',
    'in_progress',
    'draft_submitted',
    'in_review',
    'revisions_needed',
    'approved',
    'published',
    'completed',
    'cancelled'
);

-- ============================================
-- 11. AFFILIATE LINKS TABLE
-- ============================================
CREATE TABLE affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    affiliate_network TEXT,
    affiliate_id TEXT,
    tracking_url TEXT,
    discount_code TEXT,
    commission_rate DECIMAL(5,2),
    cookie_duration_days INTEGER,
    start_date DATE,
    end_date DATE,
    active_status BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. REVENUE TABLE
-- ============================================
CREATE TABLE revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    partnership_agreement_id UUID REFERENCES partnership_agreements(id) ON DELETE CASCADE,
    revenue_type TEXT,
    amount DECIMAL(10,2) NOT NULL,
    date_earned DATE,
    invoice_number TEXT,
    invoice_date DATE,
    due_date DATE,
    paid_date DATE,
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    affiliate_network TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Revenue types enum
CREATE TYPE revenue_type AS ENUM (
    'affiliate_commission',
    'referral_fee',
    'sponsored_content',
    'user_generated_content',
    'product_licensing',
    'speaking',
    'consulting',
    'product_testing',
    'accessibility_advisory',
    'flat_campaign_fee',
    'bonus',
    'other'
);

-- Payment statuses enum
CREATE TYPE payment_status AS ENUM (
    'pending',
    'invoiced',
    'overdue',
    'paid',
    'cancelled',
    'disputed'
);

-- ============================================
-- 13. TASKS TABLE
-- ============================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    task_type TEXT,
    task_title TEXT NOT NULL,
    task_description TEXT,
    priority TEXT DEFAULT 'medium',
    due_date DATE,
    recurrence_rule TEXT,
    status TEXT DEFAULT 'active',
    assigned_to UUID REFERENCES auth.users(id),
    automated BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Task priorities enum
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Task statuses enum
CREATE TYPE task_status AS ENUM ('active', 'completed', 'cancelled', 'deferred');

-- ============================================
-- 14. SUPPRESSION LIST TABLE
-- ============================================
CREATE TABLE suppression_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    suppression_reason TEXT,
    suppression_date DATE DEFAULT CURRENT_DATE,
    source TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppression reasons enum
CREATE TYPE suppression_reason AS ENUM (
    'opted_out',
    'declined_further_contact',
    'invalid_address',
    'legal_request',
    'duplicate',
    'do_not_contact',
    'other'
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppression_list ENABLE ROW LEVEL SECURITY;

-- Create policies (owner can see all, but we'll refine this later)
CREATE POLICY "Enable all access for authenticated users" ON companies
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON contacts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON programs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON opportunities
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON outreach_messages
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON email_threads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON applications
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON partnership_assets
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON partnership_agreements
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON deliverables
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON affiliate_links
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON revenue
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON tasks
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON suppression_list
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_companies_category ON companies(category);
CREATE INDEX idx_companies_priority ON companies(priority_level);
CREATE INDEX idx_companies_active ON companies(active_status);

CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_contacts_email ON contacts(email);

CREATE INDEX idx_programs_company ON programs(company_id);
CREATE INDEX idx_programs_active ON programs(active_status);

CREATE INDEX idx_opportunities_company ON opportunities(company_id);
CREATE INDEX idx_opportunities_stage ON opportunities(opportunity_stage);
CREATE INDEX idx_opportunities_priority ON opportunities(overall_priority_score);
CREATE INDEX idx_opportunities_next_action ON opportunities(next_action_date);

CREATE INDEX idx_outreach_opportunity ON outreach_messages(opportunity_id);
CREATE INDEX idx_outreach_status ON outreach_messages(approval_status);
CREATE INDEX idx_outreach_scheduled ON outreach_messages(scheduled_send_date);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due ON tasks(due_date);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);

CREATE INDEX idx_revenue_company ON revenue(company_id);
CREATE INDEX idx_revenue_date ON revenue(date_earned);
CREATE INDEX idx_revenue_status ON revenue(payment_status);

-- ============================================
-- UPDATED AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outreach_messages_updated_at BEFORE UPDATE ON outreach_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_threads_updated_at BEFORE UPDATE ON email_threads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partnership_assets_updated_at BEFORE UPDATE ON partnership_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partnership_agreements_updated_at BEFORE UPDATE ON partnership_agreements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliverables_updated_at BEFORE UPDATE ON deliverables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_links_updated_at BEFORE UPDATE ON affiliate_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_updated_at BEFORE UPDATE ON revenue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppression_list_updated_at BEFORE UPDATE ON suppression_list
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();