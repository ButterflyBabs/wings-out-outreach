import { NextRequest, NextResponse } from 'next/server';
import { researchCompanies, scoreOpportunity, validateCompanyUnique } from '@/lib/ai-research';
import { createClient } from '@supabase/supabase-js';

// Mark as dynamic
export const dynamic = 'force-dynamic';

// CRON secret for security
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting daily AI research...');

    // Initialize Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Research 10 new companies
    const researchedCompanies = await researchCompanies(10);
    console.log(`Researched ${researchedCompanies.length} companies`);

    const results = {
      imported: 0,
      skipped: 0,
      errors: [] as string[]
    };

    for (const companyData of researchedCompanies) {
      try {
        // Check if company already exists
        const isUnique = await validateCompanyUnique(
          companyData.company_name,
          companyData.website_url,
          supabase
        );

        if (!isUnique) {
          console.log(`Skipping duplicate: ${companyData.company_name}`);
          results.skipped++;
          continue;
        }

        // Score the opportunity
        const scores = await scoreOpportunity(companyData);

        // Calculate overall priority score (0-100)
        const overallPriorityScore = Math.round(
          (scores.fit_score * 0.25 +
           scores.revenue_score * 0.25 +
           scores.brand_alignment_score * 0.20 +
           scores.relationship_value_score * 0.15 +
           scores.response_probability_score * 0.15) * 10
        );

        // Determine priority level
        let priorityLevel = 'C';
        if (overallPriorityScore >= 80) priorityLevel = 'A';
        else if (overallPriorityScore >= 65) priorityLevel = 'B';
        else if (overallPriorityScore >= 50) priorityLevel = 'C';
        else priorityLevel = 'D';

        // Insert company
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            company_name: companyData.company_name,
            website_url: companyData.website_url,
            category: companyData.category,
            subcategory: companyData.subcategory,
            brand_summary: companyData.brand_summary,
            accessibility_relevance: companyData.accessibility_relevance,
            service_dog_relevance: companyData.service_dog_relevance,
            priority_level: priorityLevel,
            global_control_sync_status: 'pending'
          })
          .select()
          .single();

        if (companyError) throw companyError;

        // Add contact if available
        if (companyData.contact_email || companyData.contact_name) {
          await supabase.from('contacts').insert({
            company_id: company.id,
            first_name: companyData.contact_name?.split(' ')[0] || null,
            last_name: companyData.contact_name?.split(' ').slice(1).join(' ') || null,
            email: companyData.contact_email || null,
            title: companyData.contact_title || null,
            verified_status: false
          });
        }

        // Create opportunity
        await supabase.from('opportunities').insert({
          company_id: company.id,
          opportunity_title: `${companyData.company_name} Partnership`,
          opportunity_stage: 'research',
          fit_score: scores.fit_score,
          revenue_score: scores.revenue_score,
          brand_alignment_score: scores.brand_alignment_score,
          response_probability_score: scores.response_probability_score,
          relationship_value_score: scores.relationship_value_score,
          overall_priority_score: overallPriorityScore,
          personalized_pitch_angle: scores.pitch_angle,
          proposed_content_concept: scores.content_concept,
          next_action: 'Review AI research and approve outreach',
          next_action_date: new Date().toISOString().split('T')[0]
        });

        // Create task for Babs to review
        await supabase.from('tasks').insert({
          company_id: company.id,
          task_type: 'review',
          task_title: `Review AI-researched company: ${companyData.company_name}`,
          task_description: `AI found this company and scored it ${overallPriorityScore}/100. Review the research and decide on next steps.`,
          priority: priorityLevel === 'A' ? 'high' : priorityLevel === 'B' ? 'medium' : 'low',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days
          status: 'pending'
        });

        results.imported++;
        console.log(`Imported: ${companyData.company_name} (Priority ${priorityLevel})`);

      } catch (error: any) {
        console.error(`Error importing ${companyData.company_name}:`, error);
        results.errors.push(`${companyData.company_name}: ${error.message}`);
      }
    }

    // Send notification (you can integrate with your notification system)
    console.log('Daily research complete:', results);

    return NextResponse.json({
      success: true,
      message: `Daily research complete. Imported ${results.imported} companies, skipped ${results.skipped} duplicates.`,
      results
    });

  } catch (error: any) {
    console.error('Daily research failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
