import { NextRequest, NextResponse } from 'next/server';
import {
  getKnowledge,
  addKnowledgeEntry,
  deleteKnowledgeEntry,
} from '@/lib/ux-agent/knowledge-manager';
import { UXKnowledgeEntry } from '@/lib/ux-agent/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category') || undefined;

    const entries = await getKnowledge(category);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Knowledge GET error:', error);
    return NextResponse.json(
      { error: 'Failed to read knowledge base' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entry = body.entry as UXKnowledgeEntry;

    if (!entry || !entry.id || !entry.category || !entry.title) {
      return NextResponse.json(
        { error: 'Invalid entry: id, category, and title are required' },
        { status: 400 },
      );
    }

    await addKnowledgeEntry(entry);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Knowledge POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add knowledge entry' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 },
      );
    }

    const deleted = await deleteKnowledgeEntry(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Knowledge DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete knowledge entry' },
      { status: 500 },
    );
  }
}
