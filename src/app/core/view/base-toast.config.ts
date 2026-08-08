import { ExternalToast } from 'ngx-sonner';

export const baseToastConfig: ExternalToast = {
  position: 'bottom-right',
  unstyled: true,
  class:
    'border border-border bg-card flex gap-2 p-3 items-center justify-center rounded-sm',
};
