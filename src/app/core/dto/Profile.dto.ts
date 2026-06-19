export const TECHMATI_ROLES = ['root', 'admin', 'moderator', 'analyst', 'user'] as const;

export type TechmatiRole = (typeof TECHMATI_ROLES)[number];

export interface Profile {
  id: string;
  fullName: string;
  username: string;
  role: TechmatiRole;
  createdAt: string;
}
