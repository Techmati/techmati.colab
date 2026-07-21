import { Contributor } from '@/core/types/contributor.type';
import type { LanguageVariant } from '@/core/types/language-variant.type';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'tm-active-contributor-card',
  imports: [ZardDividerComponent],
  templateUrl: './active-contributor-card.html',
  styleUrl: './active-contributor-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveContributorCard {
  readonly contributor = input.required<Contributor>();

  readonly edit = output<Contributor>();

  protected status = computed(() => (this.contributor().accountUserId ? 'auto' : 'managed'));
  protected statusInfo = computed(() => statusLabels[this.status()]);

  protected variantName(v: { name: string; autodenominacion: string | null }): string {
    return v.autodenominacion ? `${v.name} (${v.autodenominacion})` : v.name;
  }
  protected onEdit(): void {
    this.edit.emit(this.contributor());
  }
}

const statusLabels: Record<string, { label: string; icon: string }> = {
  auto: { label: 'Auto', icon: 'lucide--zap' },
  managed: { label: 'Gestionado', icon: 'lucide--notebook-tabs' },
};
