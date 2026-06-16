import { NextResponse } from 'next/server';
import { isAdmin, isSuperAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sb = createAdminClient();
  const { data, error } = await sb
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const sb = createAdminClient();

  const { data: { user }, error: createError } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: 'admin' },
  });

  if (createError || !user) {
    return NextResponse.json({ error: createError?.message ?? 'Failed to create user' }, { status: 500 });
  }

  const { data, error: insertError } = await sb
    .from('admin_users')
    .insert({ id: user.id, email: user.email, role: 'admin' })
    .select()
    .single();

  if (insertError) {
    await sb.auth.admin.deleteUser(user.id);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
