import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body   = await req.json();
  const sb     = createAdminClient();

  const update: Record<string, unknown> = { ...body, updated_at: new Date().toISOString() };

  // Record sent_at the first time it's published
  if (body.published === true) {
    const { data: existing } = await sb
      .from('newsletters')
      .select('sent_at')
      .eq('id', Number(id))
      .single();
    if (existing && !existing.sent_at) {
      update.sent_at = new Date().toISOString();
    }
  }

  const { error } = await sb
    .from('newsletters')
    .update(update)
    .eq('id', Number(id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const sb     = createAdminClient();

  const { error } = await sb.from('newsletters').delete().eq('id', Number(id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
