import { Contributor } from '@/core/types/contributor.type';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'tm-contributor-card',
  imports: [],
  templateUrl: './contributor-card.html',
  styleUrl: './contributor-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorCard {
  readonly contributor = input.required<Contributor>();

  readonly activate = output<string>();
  readonly edit = output<string>();
  readonly remove = output<string>();

  protected status = computed(() => (this.contributor().accountUserId ? 'auto' : 'managed'));
  protected statusInfo = computed(() => statusLabels[this.status()]);

  protected onActivate(): void {
    this.activate.emit(this.contributor().id);
  }

  protected onEdit(): void {
    this.edit.emit(this.contributor().id);
  }

  protected onRemove(): void {
    this.remove.emit(this.contributor().id);
  }
}

const statusLabels: Record<string, { label: string; icon: string }> = {
  auto: { label: 'Auto', icon: 'lucide--zap' },
  managed: { label: 'Gestionado', icon: 'lucide--notebook-tabs' },
};

