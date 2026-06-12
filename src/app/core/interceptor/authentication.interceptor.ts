import { API } from '@/core/config/api-uris.config';
import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';

export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(API.BASE_URL)) {
    return next(request);
  }

  const authenticationService = inject(AuthenticationService);

  return from(authenticationService.getAccessToken()).pipe(
    switchMap((accessToken) =>
      next(
        accessToken
          ? request.clone({
              setHeaders: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
          : request,
      ),
    ),
  );
};
