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

const statusLabels = {
  auto: { label: 'Yo', icon: 'lucide-zap' },
  managed: { label: 'Gesionado', icon: 'lucide--notebook-tabs' },
};
