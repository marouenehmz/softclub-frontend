export type UserRole = 'VIP' | 'WORKER' | 'ADMIN';
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
