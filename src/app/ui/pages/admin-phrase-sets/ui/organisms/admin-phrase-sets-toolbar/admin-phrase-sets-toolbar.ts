import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'tm-admin-phrase-sets-toolbar',
  imports: [ZardButtonComponent, ZardInputDirective],
  templateUrl: './admin-phrase-sets-toolbar.html',
  styleUrl: './admin-phrase-sets-toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsToolbar {}
