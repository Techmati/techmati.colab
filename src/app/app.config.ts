import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { authenticationInterceptor } from '@/core/interceptor/authentication.interceptor';
import { provideZard } from '@/shared/core/provider/providezard';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEsMx from '@angular/common/locales/es-MX';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { routes } from './app.routes';;

registerLocaleData(localeEsMx);
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withComponentInputBinding(),
    ),
    provideZard(),
    provideTanStackQuery(new QueryClient()),
  ],
};
