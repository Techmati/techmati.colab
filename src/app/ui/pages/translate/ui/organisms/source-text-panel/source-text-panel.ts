import { Phrase } from '@/core/types/phrase.type';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'tm-source-text-panel',
  imports: [CommonModule],
  templateUrl: './source-text-panel.html',
  styleUrl: './source-text-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceTextPanel {
  readonly phrase = input.required<Phrase | null>();
  readonly isLoading = input.required<boolean>();

  protected readonly text = linkedSignal<string | undefined, string>({
    source: () => this.phrase()?.sourceText,
    computation: (source, previous) => source || previous?.value || '',
  });
  protected readonly sourceLanguage = computed(() => 'español');
}
