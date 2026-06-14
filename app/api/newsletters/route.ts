import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const sb   = createAdminClient();

  const { data, error } = await sb
    .from('newsletters')
    .insert({
      title:     body.title,
      subject:   body.subject,
      content:   body.content,
      published: body.published ?? false,
      sent_at:   body.published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
