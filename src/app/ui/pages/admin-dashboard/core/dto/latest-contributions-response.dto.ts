import { Profile } from '@/core/dto/Profile.dto';
import { PhraseSet } from '@/core/types/phrase-set.type';
import { Summary } from '@/core/types/summary.type';

export type RecentContributionDto = Summary & {
  contributor: Profile;
  phraseSet: PhraseSet;
};

export type LatestContributionsResponseDto = { latestContributions: RecentContributionDto[] };
