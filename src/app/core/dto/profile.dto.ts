export const TECHMATI_ROLES = ['root', 'admin', 'moderator', 'analyst', 'collector', 'user'] as const;

export type TechmatiRole = (typeof TECHMATI_ROLES)[number];

export interface Profile {
  id: string;
  fullName: string | null;
  username: string;
  email: string | null;
  bannedUntil: string | null;
  role: TechmatiRole;
  createdAt: string;
}
