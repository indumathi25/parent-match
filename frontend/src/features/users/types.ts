export interface UserProfile {
  id: string;
  auth0_sub: string;
  name: string | null;
  email: string | null;
  created_at: string;
}
