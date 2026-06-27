import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tm-admin-user-detail-field',
  imports: [],
  templateUrl: './admin-user-detail-field.html',
  styleUrl: './admin-user-detail-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserDetailField {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly icon = input.required<string>();
}
