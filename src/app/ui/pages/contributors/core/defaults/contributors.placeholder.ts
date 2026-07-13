import type { Contributor } from '@/core/types/contributor.type';

export const PLACEHOLDER_CONTRIBUTORS: readonly Contributor[] = [
  {
    id: 'ctr-ana-garcia',
    fullName: 'Ana García',
    ownerUserId: 'usr-1',
    accountUserId: null,
    createdAt: '2025-01-15T10:00:00.000Z',
    variants: [
      { id: 'var-nah-central', code: 'nah-central', label: 'Náhuatl Central' },
      { id: 'var-huasteca', code: 'nah-huasteca', label: 'Huasteca' },
    ],
  },
  {
    id: 'ctr-maria-xochitl',
    fullName: 'María Xochitl',
    ownerUserId: 'usr-2',
    accountUserId: null,
    createdAt: '2025-02-20T10:00:00.000Z',
    variants: [
      { id: 'var-huasteca', code: 'nah-huasteca', label: 'Huasteca' },
      { id: 'var-sierra-norte', code: 'nah-sierra-norte', label: 'Sierra Norte' },
    ],
  },
  {
    id: 'ctr-ernesto-xihuatonca',
    fullName: 'Ernesto Xihuatonca',
    ownerUserId: 'usr-2',
    accountUserId: null,
    createdAt: '2025-03-10T10:00:00.000Z',
    variants: [
      { id: 'var-huasteca', code: 'nah-huasteca', label: 'Huasteca' },
      { id: 'var-sierra-norte', code: 'nah-sierra-norte', label: 'Sierra Norte' },
    ],
  },
];