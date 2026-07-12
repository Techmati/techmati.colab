import { LatestContributionDto } from '@/core/types/stats.type';

export type RecentContributionDto = LatestContributionDto;

export type LatestContributionsResponseDto = {
  data: RecentContributionDto[];
  total: number;
};
