export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: UserRole;
  countryId: string;
  address: string;
  createdAt: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  loaded: boolean;
  error: string | null;
  saving: boolean;
  deleting: boolean;
}
