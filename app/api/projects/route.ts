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
    .from('projects')
    .insert({
      title:       body.title,
      description: body.description,
      content:     body.content,
      image:       body.image,
      category:    body.category,
      published:   body.published ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
