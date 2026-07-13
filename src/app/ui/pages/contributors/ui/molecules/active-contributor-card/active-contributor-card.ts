import { Contributor } from '@/core/types/contributor.type';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'tm-active-contributor-card',
  imports: [],
  templateUrl: './active-contributor-card.html',
  styleUrl: './active-contributor-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveContributorCard {
  readonly contributor = input.required<Contributor>();

  protected status = computed(() => (this.contributor().accountUserId ? 'auto' : 'managed'));
  protected statusInfo = computed(() => statusLabels[this.status()]);
}

const statusLabels: Record<string, { label: string; icon: string }> = {
  auto: { label: 'Auto', icon: 'lucide--zap' },
  managed: { label: 'Gestionado', icon: 'lucide--notebook-tabs' },
};
