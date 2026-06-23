export type AdminDashboardTone = 'purple' | 'green';

export interface AdminQuickAction {
  readonly label: string;
  readonly icon: string;
  readonly tone: AdminDashboardTone;
  readonly variant: 'solid' | 'outline';
}
