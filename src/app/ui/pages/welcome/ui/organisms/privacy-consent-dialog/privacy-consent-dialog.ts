import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { Z_MODAL_DATA, ZardDialogRef } from '@/shared/components/dialog';
import { ZardSwitchComponent } from '@/shared/components/switch';

export interface PrivacyConsentDialogData {
  onConfirm: () => Promise<void>;
}

@Component({
  selector: 'tm-privacy-consent-dialog',
  imports: [ZardButtonComponent, ZardSwitchComponent],
  templateUrl: './privacy-consent-dialog.html',
  styleUrl: './privacy-consent-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyConsentDialog {
  private readonly dialogRef = inject(ZardDialogRef);
  protected readonly data = inject<PrivacyConsentDialogData>(Z_MODAL_DATA);

  protected readonly consent = signal(false);
  protected readonly submitting = signal(false);

  protected confirm(): void {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.dialogRef.close();
    void this.data.onConfirm();
  }
}
