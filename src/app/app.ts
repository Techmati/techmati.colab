import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppBanner } from './ui/organisms/app-banner/app-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppBanner],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App { }
