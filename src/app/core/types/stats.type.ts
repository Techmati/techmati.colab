export interface StatsOverview {
  todayContributions: number;
  todayNewUsers: number;
}

export interface LatestContributionDto {
  translationId: string;
  contributorId: string;
  contributorAlias: string | null;
  ownerUserId: string | null;
  accountUserId: string | null;
  phraseSetId: string;
  phraseSetTitle: string | null;
  attemptedAt: string;
  contributedEntriesCount: number;
  progressPercentage: number;
  inProgress: boolean;
  completed: boolean;
  lastUpdate: string | null;
}

export interface LatestUserDto {
  id: string;
  fullName: string | null;
  username: string;
  email: string | null;
  createdAt: string;
}
