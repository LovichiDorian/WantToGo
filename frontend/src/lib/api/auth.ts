import { apiRequest } from './client';

export interface User {
  id: string;
  email: string;
  name: string | null;
  shareCode: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const TOKEN_KEY = 'wanttogo-auth-token';
const USER_KEY = 'wanttogo-user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function storeAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  storeAuth(response.accessToken, response.user);
  return response;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  storeAuth(response.accessToken, response.user);
  return response;
}

export async function getMe(): Promise<User> {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  return apiRequest<User>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function logout(): void {
  clearAuth();
}
