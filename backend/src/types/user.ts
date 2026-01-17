export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  hashed_password: string;
  role: "user" | "admin" | "seller";
  is_verified: boolean;
  last_login_at?: Date;
}

export interface RegisterBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface EmailTokenPayload {
  email: string;
}

export interface AuthTokenPayload {
  id: number;
  email: string;
  role: string;
}
