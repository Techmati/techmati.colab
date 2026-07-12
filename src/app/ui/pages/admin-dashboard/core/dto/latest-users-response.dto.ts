import { Profile } from '@/core/dto/profile.dto';

export type LatestUsersResponseDto = {
  data: Profile[];
  total: number;
};
