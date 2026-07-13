export type ContributorStatus = 'auto' | 'gestionado';

export const CONTRIBUTOR_STATUS_LABELS: Record<ContributorStatus, string> = {
  auto: 'Auto',
  gestionado: 'Gestionado',
};

export interface ContributorFormModel {
  name: string;
  variants: string[];
}