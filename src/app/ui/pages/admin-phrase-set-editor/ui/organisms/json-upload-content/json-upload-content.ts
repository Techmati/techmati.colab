import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Z_ALERT_MODAL_DATA } from '@/shared/components/alert-dialog';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'tm-json-upload-content',
  imports: [ZardInputDirective],
  template: `
    <div class="space-y-3">
      <p class="text-sm leading-5 text-muted-foreground">
        Pega el JSON del set de frases. Debe incluir <code class="rounded bg-muted px-1 text-xs font-mono">title</code>,
        <code class="rounded bg-muted px-1 text-xs font-mono">language</code>,
        <code class="rounded bg-muted px-1 text-xs font-mono">category</code>,
        <code class="rounded bg-muted px-1 text-xs font-mono">phrases</code> y opcionalmente
        <code class="rounded bg-muted px-1 text-xs font-mono">description</code> y
        <code class="rounded bg-muted px-1 text-xs font-mono">published</code>.
      </p>
      <textarea
        z-input
        class="min-h-40 w-full resize-none rounded-lg bg-card p-3 text-sm font-mono leading-5 shadow-sm"
        placeholder='{"title": "Saludos", "language": "nahuatl_to_spanish", "category": "general_conversation", "published": true, "phrases": [{"sourceText": "Hola", "position": 1}]}'
        [value]="jsonText()"
        (input)="onInput($event)"
      ></textarea>
      @if (error()) {
        <p class="text-sm font-medium leading-5 text-destructive" role="alert">{{ error() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonUploadContent {
  protected readonly jsonText = signal('');
  protected readonly error = signal('');

  private readonly modalData = inject(Z_ALERT_MODAL_DATA, { optional: true }) as
    | { onParsed: (data: { title: string; description?: string; language: string; category: string; published: boolean; phrases: { sourceText: string; position: number }[] }) => void }
    | undefined;

  protected onInput(event: Event): void {
    this.jsonText.set((event.target as HTMLTextAreaElement).value);
    this.error.set('');
  }

  parseAndReturn(): boolean {
    const text = this.jsonText().trim();
    if (!text) {
      this.error.set('El JSON no puede estar vacío.');
      return false;
    }
    try {
      const parsed = JSON.parse(text);
      if (!parsed.title || !parsed.language || !parsed.category || !Array.isArray(parsed.phrases)) {
        this.error.set('El JSON debe contener title, language, category y phrases.');
        return false;
      }
      this.modalData?.onParsed({
        title: parsed.title,
        description: parsed.description,
        language: parsed.language,
        category: parsed.category,
        published: parsed.published ?? false,
        phrases: parsed.phrases.map((p: { sourceText: string; position: number }, i: number) => ({
          sourceText: p.sourceText,
          position: p.position ?? i + 1,
        })),
      });
      return true;
    } catch {
      this.error.set('El JSON no es válido. Revisa la sintaxis e intenta de nuevo.');
      return false;
    }
  }
}
