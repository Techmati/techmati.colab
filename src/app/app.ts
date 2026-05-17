import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardButtonComponent } from './shared/components/button';
import { AppBanner } from './ui/organisms/app-banner/app-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ZardButtonComponent, AppBanner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Techmati-colab');
}
