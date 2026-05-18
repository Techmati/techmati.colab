import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { BatchProgressPanel } from './ui/batch-progress-panel/batch-progress-panel';
import { BottomActionBar } from './ui/bottom-action-bar/bottom-action-bar';
import { PronunciationPanel } from './ui/pronunciation-panel/pronunciation-panel';
import { RecordedPronunciationMolecule } from './ui/recorded-pronunciation-molecule/recorded-pronunciation-molecule';
import { SourceTextPanel } from './ui/source-text-panel/source-text-panel';
import { TaskTopBar } from './ui/task-top-bar/task-top-bar';
import { TranslationInputPanel } from './ui/translation-input-panel/translation-input-panel';

@Component({
  selector: 'tm-translate-page',
  imports: [
    TaskTopBar,
    BatchProgressPanel,
    SourceTextPanel,
    TranslationInputPanel,
    PronunciationPanel,
    RecordedPronunciationMolecule,
    BottomActionBar,
  ],
  templateUrl: './translate.page.html',
  styleUrl: './translate.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatePage {
  protected readonly showRecordedPronunciation = signal(false);
}
