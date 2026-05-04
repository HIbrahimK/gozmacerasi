export interface AuthUserPayload {
  sub: string;
  email: string;
  fullName?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
  };
}
