export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  tech_stack: string;
  category: string;
  github_url: string;
  live_url: string;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
