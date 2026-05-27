import { Phrase } from '@/core/types/phrase.type';
import { ZardDividerComponent } from '@/shared/components/divider';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'tm-source-text-panel',
  imports: [ZardDividerComponent, CommonModule],
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
  protected readonly context = computed(() => this.phrase()?.context || '');
  protected readonly sourceLanguage = computed(() => {
    const language = this.phrase()?.language || 'spanish_to_nahuatl';
    const map: { [key: string]: string } = {
      nahuatl_to_spanish: 'náhuatl',
      spanish_to_nahuatl: 'español',
    };
    return map[language];
  });
}
