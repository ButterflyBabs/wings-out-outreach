import { supabase } from './supabase';

const GLOBAL_CONTROL_API_URL = 'https://api.globalcontrolcrm.com/v1';
const GLOBAL_CONTROL_API_KEY = process.env.GLOBAL_CONTROL_API_KEY;

// Types for Global Control API
interface GlobalControlContact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  source?: string;
}

interface GlobalControlWorkflow {
  id: string;
  name: string;
}

// Sync a company from Wings Out to Global Control as a contact
export async function syncCompanyToGlobalControl(companyId: string) {
  try {
    // Get company data from Supabase
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error || !company) {
      throw new Error(`Company not found: ${error?.message}`);
    }

    // Get primary contact for this company
    const { data: contacts } = await supabase
      .from('contacts')
      .select('*')
      .eq('company_id', companyId)
      .limit(1);

    const primaryContact = contacts?.[0];

    // Prepare contact data for Global Control
    const contactData: GlobalControlContact = {
      email: primaryContact?.email || `${company.company_name.toLowerCase().replace(/\s+/g, '.')}@placeholder.com`,
      firstName: primaryContact?.first_name || company.company_name,
      lastName: primaryContact?.last_name || '',
      phone: primaryContact?.phone || '',
      tags: [
        'wings-out-outreach',
        'prospect',
        company.category || 'uncategorized',
        `priority-${company.priority_level || 'c'}`
      ],
      customFields: {
        company_name: company.company_name,
        company_website: company.website_url,
        company_category: company.category,
        company_subcategory: company.subcategory,
        accessibility_relevance: company.accessibility_relevance,
        service_dog_relevance: company.service_dog_relevance,
        wings_out_company_id: company.id,
        source: 'Wings Out Outreach'
      },
      source: 'Wings Out Outreach'
    };

    // Send to Global Control API
    const response = await fetch(`${GLOBAL_CONTROL_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GLOBAL_CONTROL_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Workspace-Id': process.env.GLOBAL_CONTROL_WORKSPACE_ID || ''
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Global Control API error: ${errorData.message || response.statusText}`);
    }

    const globalControlContact = await response.json();

    // Update company in Supabase with Global Control ID
    await supabase
      .from('companies')
      .update({
        global_control_contact_id: globalControlContact.id,
        global_control_synced_at: new Date().toISOString()
      })
      .eq('id', companyId);

    return {
      success: true,
      globalControlContactId: globalControlContact.id,
      message: `Company "${company.company_name}" synced to Global Control`
    };

  } catch (error) {
    console.error('Error syncing to Global Control:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Add contact to Global Control workflow
export async function addContactToWorkflow(contactId: string, workflowId: string) {
  try {
    const response = await fetch(`${GLOBAL_CONTROL_API_URL}/contacts/${contactId}/workflows`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GLOBAL_CONTROL_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Workspace-Id': process.env.GLOBAL_CONTROL_WORKSPACE_ID || ''
      },
      body: JSON.stringify({
        workflowId,
        startImmediately: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add to workflow: ${errorData.message || response.statusText}`);
    }

    return {
      success: true,
      message: 'Contact added to workflow'
    };

  } catch (error) {
    console.error('Error adding to workflow:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get available workflows from Global Control
export async function getGlobalControlWorkflows() {
  try {
    const response = await fetch(`${GLOBAL_CONTROL_API_URL}/workflows`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GLOBAL_CONTROL_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Workspace-Id': process.env.GLOBAL_CONTROL_WORKSPACE_ID || ''
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workflows: ${response.statusText}`);
    }

    const workflows = await response.json();
    return {
      success: true,
      workflows
    };

  } catch (error) {
    console.error('Error fetching workflows:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      workflows: []
    };
  }
}

// Sync opportunity stage change to Global Control
export async function syncOpportunityStage(opportunityId: string, newStage: string) {
  try {
    // Get opportunity data
    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .select(`
        *,
        companies (
          global_control_contact_id,
          company_name
        )
      `)
      .eq('id', opportunityId)
      .single();

    if (error || !opportunity) {
      throw new Error(`Opportunity not found: ${error?.message}`);
    }

    const globalControlContactId = opportunity.companies?.global_control_contact_id;

    if (!globalControlContactId) {
      // Company not synced yet, sync it first
      const syncResult = await syncCompanyToGlobalControl(opportunity.company_id);
      if (!syncResult.success) {
        throw new Error('Failed to sync company first');
      }
    }

    // Update contact tags based on opportunity stage
    const stageTag = `stage-${newStage.toLowerCase().replace(/\s+/g, '-')}`;
    
    const response = await fetch(`${GLOBAL_CONTROL_API_URL}/contacts/${globalControlContactId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GLOBAL_CONTROL_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Workspace-Id': process.env.GLOBAL_CONTROL_WORKSPACE_ID || ''
      },
      body: JSON.stringify({
        tags: [stageTag, 'wings-out-outreach', 'opportunity'],
        customFields: {
          opportunity_stage: newStage,
          opportunity_updated_at: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to update contact: ${response.statusText}`);
    }

    return {
      success: true,
      message: `Opportunity stage updated to "${newStage}" in Global Control`
    };

  } catch (error) {
    console.error('Error syncing opportunity stage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Bulk sync all companies to Global Control
export async function bulkSyncCompaniesToGlobalControl() {
  try {
    // Get all companies not yet synced
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .is('global_control_contact_id', null)
      .limit(50);

    if (error) {
      throw new Error(`Failed to fetch companies: ${error.message}`);
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const company of companies || []) {
      const result = await syncCompanyToGlobalControl(company.id);
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(`${company.company_name}: ${result.error}`);
      }
    }

    return {
      success: true,
      message: `Synced ${results.success} companies to Global Control (${results.failed} failed)`,
      details: results
    };

  } catch (error) {
    console.error('Error in bulk sync:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}