import { NextRequest, NextResponse } from 'next/server';

// Mark as dynamic to avoid static generation
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Dynamically import to avoid build-time issues
    const { syncCompanyToGlobalControl, bulkSyncCompaniesToGlobalControl } = await import('@/lib/global-control');
    
    const body = await request.json();
    const { companyId, bulk = false } = body;

    if (bulk) {
      const result = await bulkSyncCompaniesToGlobalControl();
      return NextResponse.json(result);
    }

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const result = await syncCompanyToGlobalControl(companyId);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in sync API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
