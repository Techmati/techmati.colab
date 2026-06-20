export type AdminDashboardTone = 'purple' | 'green';

export interface AdminMetric {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
  readonly tone: AdminDashboardTone;
}

export interface AdminQuickAction {
  readonly label: string;
  readonly icon: string;
  readonly tone: AdminDashboardTone;
  readonly variant: 'solid' | 'outline';
}

export interface RecentContribution {
  readonly contributorName: string;
  readonly initials: string;
  readonly phraseSet: string;
  readonly completedPhrases: number;
  readonly totalPhrases: number;
  readonly submittedAt: string;
}

export interface AdminUserPreview {
  readonly fullName: string;
  readonly initials: string;
  readonly username: string;
  readonly email: string;
}
