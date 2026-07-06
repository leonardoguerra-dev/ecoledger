export interface UserProfile {
  email: string;
  role: 'EnterpriseAdmin' | 'Auditor';
  companyName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}