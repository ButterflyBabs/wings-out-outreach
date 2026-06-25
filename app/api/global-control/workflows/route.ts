import { NextRequest, NextResponse } from 'next/server';

// Mark as dynamic to avoid static generation
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Dynamically import to avoid build-time issues
    const { getGlobalControlWorkflows } = await import('@/lib/global-control');
    
    const result = await getGlobalControlWorkflows();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        workflows: []
      },
      { status: 500 }
    );
  }
}
