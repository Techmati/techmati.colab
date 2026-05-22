import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule, type FormGroup } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';

@Component({
  selector: 'tm-welcome-panel',
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage,
    ZardButtonComponent,
    ZardInputDirective,
    ZardInputGroupComponent,
  ],
  templateUrl: './welcome-panel.html',
  styleUrl: './welcome-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePanel {
  readonly form = input.required<FormGroup>();
  readonly submit = output();

  protected readonly logoUrl = 'https://www.figma.com/api/mcp/asset/165e82df-7b23-42f7-b342-fb7fa1c9b15a';
}
