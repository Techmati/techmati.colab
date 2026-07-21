import { LanguageVariant } from '@/core/types/language-variant.type';
import type { Contributor } from '@/core/types/contributor.type';

export const EMPTY_CONTRIBUTOR: LanguageVariant = {
  id: '',
  groupId: '',
  name: '',
  autodenominacion: null,
  iso639Code: null,
  inaliCode: '',
};

export const CONTRIBUTORS_PLACEHOLDER: Contributor[] = [
  {
    id: 'contrib-1',
    ownerUserId: 'usr-carlos',
    accountUserId: 'usr-carlos',
    fullName: 'Carlos Mendoza',
    createdAt: '2024-01-15T10:00:00.000Z',
    variants: [
      {
        id: 'var-nah-central',
        groupId: 'grp-nah',
        name: 'Náhuatl Central', autodenominacion: null,
        iso639Code: null, inaliCode: 'nah01',
      },
    ],
  },
  {
    id: 'contrib-2',
    ownerUserId: 'usr-maria',
    accountUserId: null,
    fullName: 'María Hernández',
    createdAt: '2024-02-20T10:00:00.000Z',
    variants: [
      {
        id: 'var-huasteca',
        groupId: 'grp-nah',
        name: 'Huasteca', autodenominacion: null,
        iso639Code: null, inaliCode: 'nah02',
      },
    ],
  },
  {
    id: 'contrib-3',
    ownerUserId: 'usr-juan',
    accountUserId: null,
    fullName: 'Juan Pérez',
    createdAt: '2024-03-10T10:00:00.000Z',
    variants: [
      {
        id: 'var-sierra-norte',
        groupId: 'grp-nah',
        name: 'Sierra Norte', autodenominacion: null,
        iso639Code: null, inaliCode: 'nah03',
      },
    ],
  },
];
