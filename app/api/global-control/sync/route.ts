import { NextRequest, NextResponse } from 'next/server';
import { syncCompanyToGlobalControl, bulkSyncCompaniesToGlobalControl } from '@/lib/global-control';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, bulk = false } = body;

    if (bulk) {
      // Bulk sync all unsynced companies
      const result = await bulkSyncCompaniesToGlobalControl();
      return NextResponse.json(result);
    }

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Sync single company
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
