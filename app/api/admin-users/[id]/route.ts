import { NextResponse } from 'next/server';
import { isSuperAdmin, getAdminUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const currentUser = await getAdminUser();

  if (currentUser?.id === id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  const sb = createAdminClient();

  // Prevent deleting other super admins
  const { data: target } = await sb
    .from('admin_users')
    .select('role')
    .eq('id', id)
    .single();

  if (target?.role === 'super_admin') {
    return NextResponse.json({ error: 'Cannot delete a super admin account' }, { status: 400 });
  }

  const { error } = await sb.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
