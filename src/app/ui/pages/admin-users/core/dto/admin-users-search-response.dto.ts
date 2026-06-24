import { Profile } from '@/core/dto/profile.dto';

export interface AdminUsersSearchResponseDto {
  users: Profile[];
  total: number;
}
