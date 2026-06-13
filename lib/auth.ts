import { cookies } from 'next/headers';

export async function isAdmin(): Promise<boolean> {
  const jar      = await cookies();
  const cookie   = jar.get('odu_admin_auth');
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(cookie && expected && cookie.value === expected);
}
