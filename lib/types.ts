export interface Blog {
  id: number;
  blog_id: number;
  title: string;
  content: string;
  image: string;
  category: string;
  firstname: string;
  lastname: string;
  views: number;
  likes: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  blog_id: number;
  user_id: string;
  name: string;
  text: string;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Newsletter {
  id: number;
  title: string;
  subject: string;
  content: string;
  published: boolean;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  subscribed: boolean;
  created_at: string;
}
