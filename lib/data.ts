import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Blog, Comment, Project, Newsletter, Subscriber } from '@/lib/types';

function mapBlog(row: Record<string, unknown>): Blog {
  return { ...(row as unknown as Blog), blog_id: row.id as number };
}

export async function getAllBlogsAdmin(): Promise<Blog[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(mapBlog);
}

export async function getSingleBlog(id: number): Promise<Blog | null> {
  const sb = await createClient();
  const { data, error } = await sb
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return mapBlog(data as Record<string, unknown>);
}

export async function getAllComments(): Promise<Comment[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Comment[];
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Project[];
}

export async function getSingleProject(id: number): Promise<Project | null> {
  const sb = await createClient();
  const { data, error } = await sb
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data as Project;
}

export async function getAllNewslettersAdmin(): Promise<Newsletter[]> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from('newsletters')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Newsletter[];
}

export async function getSingleNewsletter(id: number): Promise<Newsletter | null> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from('newsletters')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data as Newsletter;
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Subscriber[];
}
