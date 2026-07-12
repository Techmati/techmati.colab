import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tm-admin-user-contributions-panel',
  imports: [],
  templateUrl: './admin-user-contributions-panel.html',
  styleUrl: './admin-user-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionsPanel {
  readonly isLoading = input.required<boolean>();
}
