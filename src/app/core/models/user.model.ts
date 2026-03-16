export type UserRole = 'VIP' | 'STAFF' | 'ADMIN';
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
