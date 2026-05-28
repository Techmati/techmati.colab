import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: number | string | Date | null | undefined, nowInput?: number | Date): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    console.log({ value, dateValue: new Date(value) });

    const targetTime = this.toUnixMs(value);
    if (targetTime === null) {
      return '';
    }

    const now = this.resolveNow(nowInput);
    const diffMs = Math.max(0, now - targetTime);
    const diffSeconds = Math.floor(diffMs / 1000);

    const units: ReadonlyArray<{ seconds: number; singular: string; plural: string }> = [
      { seconds: 31_536_000, singular: 'año', plural: 'años' },
      { seconds: 2_592_000, singular: 'mes', plural: 'meses' },
      { seconds: 604_800, singular: 'semana', plural: 'semanas' },
      { seconds: 86_400, singular: 'día', plural: 'días' },
      { seconds: 3_600, singular: 'hora', plural: 'horas' },
      { seconds: 60, singular: 'minuto', plural: 'minutos' },
      { seconds: 1, singular: 'segundo', plural: 'segundos' },
    ];

    for (const unit of units) {
      const amount = Math.floor(diffSeconds / unit.seconds);
      if (amount >= 1) {
        return `Hace ${amount} ${amount === 1 ? unit.singular : unit.plural}`;
      }
    }

    return 'Hace 0 segundos';
  }

  private resolveNow(nowInput?: number | Date): number {
    if (nowInput instanceof Date) {
      return nowInput.getTime();
    }

    if (typeof nowInput === 'number' && Number.isFinite(nowInput)) {
      return nowInput;
    }

    return Date.now();
  }

  private toUnixMs(value: number | string | Date): number | null {
    if (value instanceof Date) {
      const timestamp = value.getTime();
      return Number.isFinite(timestamp) ? timestamp : null;
    }

    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        return null;
      }

      // Assume unix seconds when value looks like seconds precision.
      return value < 1_000_000_000_000 ? value * 1000 : value;
    }

    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
