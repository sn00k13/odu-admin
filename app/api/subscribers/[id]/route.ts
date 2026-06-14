import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body   = await req.json();
  const sb     = createAdminClient();

  const { error } = await sb
    .from('subscribers')
    .update(body)
    .eq('id', Number(id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const sb     = createAdminClient();

  const { error } = await sb.from('subscribers').delete().eq('id', Number(id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
