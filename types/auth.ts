export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  credits: number;
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
