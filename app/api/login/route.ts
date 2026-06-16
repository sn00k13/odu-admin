import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const sb = await createClient();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const role = data.user.app_metadata?.role;
  if (role !== 'admin' && role !== 'super_admin') {
    await sb.auth.signOut();
    return NextResponse.json({ error: 'Not authorized as an admin' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
