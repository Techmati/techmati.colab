import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-phrase-sets-pagination',
  imports: [ZardButtonComponent],
  templateUrl: './admin-phrase-sets-pagination.html',
  styleUrl: './admin-phrase-sets-pagination.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsPagination {}
