import { AuthError, Factor, Session, UserAppMetadata, UserIdentity } from "@supabase/supabase-js";

export interface storedUser {
  accessToken: {
    token: string;
  };
  idToken: string;
  profile: {
    email: string;
    name: string;
    imageUrl: string;
  };
}

export interface UserMetadata {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  phone_verified: boolean;
  picture: string;
  provider_id: string;
  sub: string;
}


export interface SupabaseUser {
  id: string
  app_metadata: UserAppMetadata
  user_metadata: UserMetadata
  aud: string
  confirmation_sent_at?: string
  recovery_sent_at?: string
  email_change_sent_at?: string
  new_email?: string
  new_phone?: string
  invited_at?: string
  action_link?: string
  email?: string
  phone?: string
  created_at: string
  confirmed_at?: string
  email_confirmed_at?: string
  phone_confirmed_at?: string
  last_sign_in_at?: string
  role?: string
  updated_at?: string
  identities?: UserIdentity[]
  is_anonymous?: boolean
  is_sso_user?: boolean
  factors?: Factor[]
  deleted_at?: string
}

export interface userContext {
  userData: {
    token: string | null;
    phone: string;
    imageUrl: string;
    name: string;
    email: string;
  } | null;
  setUser: (value: userContextData | null) => void;
}

export interface userContextData {
  token: string | null;
  phone: string;
  imageUrl: string;
  name: string;
  email: string;
}

export interface SupabaseSession {
    provider_token?: string | null
  provider_refresh_token?: string | null
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: SupabaseUser

}

export type SupabaseAuthResponse =
  | {
      data: {
        user: SupabaseUser | null
        session: Session | null
      }
      error: null
    }
  | {
      data: {
        user: null
        session: null
      }
      error: AuthError
    }