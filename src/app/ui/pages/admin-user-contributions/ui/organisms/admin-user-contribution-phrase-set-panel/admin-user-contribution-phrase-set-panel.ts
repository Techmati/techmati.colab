import { type Translation } from '@/core/types/translation.type';
import { ZardButtonComponent } from '@/shared/components/button';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tm-admin-user-contribution-phrase-set-panel',
  imports: [ZardButtonComponent, RouterLink, DatePipe],
  templateUrl: './admin-user-contribution-phrase-set-panel.html',
  styleUrl: './admin-user-contribution-phrase-set-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionPhraseSetPanel {
  readonly contribution = input.required<Translation>();
}
