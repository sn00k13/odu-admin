import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const sb     = createAdminClient();

  const { error } = await sb.from('comments').delete().eq('id', Number(id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
