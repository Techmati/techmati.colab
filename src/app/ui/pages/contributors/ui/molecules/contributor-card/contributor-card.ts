import { Contributor } from '@/core/types/contributor.type';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'tm-contributor-card',
  imports: [ZardDividerComponent],
  templateUrl: './contributor-card.html',
  styleUrl: './contributor-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorCard {
  readonly contributor = input.required<Contributor>();

  readonly activate = output<Contributor>();
  readonly edit = output<Contributor>();
  readonly remove = output<Contributor>();

  protected status = computed(() => (this.contributor().accountUserId ? 'auto' : 'managed'));
  protected statusInfo = computed(() => statusLabels[this.status()]);

  protected onActivate(): void {
    this.activate.emit(this.contributor());
  }

  protected onEdit(): void {
    this.edit.emit(this.contributor());
  }

  protected onRemove(): void {
    this.remove.emit(this.contributor());
  }
}

const statusLabels: Record<string, { label: string; icon: string }> = {
  auto: { label: 'Auto', icon: 'lucide--zap' },
  managed: { label: 'Gestionado', icon: 'lucide--notebook-tabs' },
};
