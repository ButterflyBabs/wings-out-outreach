import { NextResponse } from 'next/server';
import { getGlobalControlWorkflows } from '@/lib/global-control';

export async function GET() {
  try {
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
