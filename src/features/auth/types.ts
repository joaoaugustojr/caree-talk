export type UserRole = "master" | "admin" | "tutor" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string | null;
  updated_at?: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthTokenData = {
  user: User;
  access_token: string;
  token_type: string;
  expires_at?: string | null;
};
