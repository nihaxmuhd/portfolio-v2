// TypeScript types mirroring Django models (backend/portfolio/models.py)

export interface PortfolioProfile {
  id: number;
  full_name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  profile_image: string | null;
  career_start_year: number;
}

export interface Skill {
  id: number;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "Tools" | "Mobile";
  proficiency: number; // 0-100
  order: number;
}

export interface ProjectImage {
  id: number;
  image: string;
  caption?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  featured: boolean;
  order: number;
  thumbnail?: string;
  images?: ProjectImage[];
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  start_date: string; // YYYY-MM-DD
  end_date: string | null;
  is_current: boolean;
  description: string;
  order: number;
}

export interface Resume {
  id: number;
  file: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read?: boolean;
}

export interface Stats {
  projects_built: number;
  tech_skills: number;
  years_experience: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
