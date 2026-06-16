import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const sb   = createAdminClient();

  const { data, error } = await sb
    .from('blogs')
    .insert({
      title:      body.title,
      content:    body.content,
      image:      body.image,
      category:   body.category,
      firstname:  body.firstname,
      lastname:   body.lastname,
      published:  body.published ?? false,
      views:      0,
      likes:      0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
