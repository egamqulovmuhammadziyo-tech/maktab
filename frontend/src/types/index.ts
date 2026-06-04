export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  experience?: string;
  bio?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface News {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  tag: string;
  image_url?: string;
  published: boolean;
  created_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  icon: string;
  type: 'urgent' | 'info' | 'event';
  event_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ScheduleEntry {
  id: number;
  class_name: string;
  day: string;
  lesson_order: number;
  subject: string;
}

export interface Achievement {
  id: number;
  title: string;
  description?: string;
  icon: string;
  year?: string;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  title?: string;
  image_url: string;
  category: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
