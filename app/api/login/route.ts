import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'odu_admin_auth';

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
