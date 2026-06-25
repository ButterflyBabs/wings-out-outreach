-- Migration: Add Global Control CRM Integration
-- Adds tracking columns for Global Control sync

-- Add Global Control tracking to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS global_control_contact_id TEXT,
ADD COLUMN IF NOT EXISTS global_control_synced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS global_control_sync_status TEXT DEFAULT 'pending' 
  CHECK (global_control_sync_status IN ('pending', 'synced', 'failed', 'excluded'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_global_control_id 
ON companies(global_control_contact_id);

CREATE INDEX IF NOT EXISTS idx_companies_sync_status 
ON companies(global_control_sync_status);

-- Add Global Control tracking to opportunities table
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS global_control_workflow_id TEXT,
ADD COLUMN IF NOT EXISTS global_control_workflow_status TEXT DEFAULT 'not_started'
  CHECK (global_control_workflow_status IN ('not_started', 'active', 'completed', 'paused'));

-- Create function to auto-update sync timestamp
CREATE OR REPLACE FUNCTION update_global_control_sync_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.global_control_contact_id IS NOT NULL AND 
     (OLD.global_control_contact_id IS NULL OR OLD.global_control_contact_id != NEW.global_control_contact_id) THEN
    NEW.global_control_synced_at = NOW();
    NEW.global_control_sync_status = 'synced';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating sync timestamp
DROP TRIGGER IF EXISTS trigger_update_global_control_sync ON companies;
CREATE TRIGGER trigger_update_global_control_sync
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_global_control_sync_timestamp();

-- Add comment for documentation
COMMENT ON COLUMN companies.global_control_contact_id IS 'Global Control CRM contact ID for this company';
COMMENT ON COLUMN companies.global_control_synced_at IS 'Timestamp when company was last synced to Global Control';
COMMENT ON COLUMN companies.global_control_sync_status IS 'Sync status: pending, synced, failed, or excluded';

-- Create RPC function for updating Global Control sync info
CREATE OR REPLACE FUNCTION update_company_global_control(
  p_company_id UUID,
  p_global_control_id TEXT,
  p_synced_at TIMESTAMPTZ
)
RETURNS VOID AS $$
BEGIN
  UPDATE companies
  SET 
    global_control_contact_id = p_global_control_id,
    global_control_synced_at = p_synced_at,
    global_control_sync_status = 'synced'
  WHERE id = p_company_id;
END;
$$ LANGUAGE plpgsql;
