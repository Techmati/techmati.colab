import { API } from '@/core/config/api-uris.config';
import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { GUEST_TOKEN_KEY } from '@/core/service/guest/guest.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';

export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(API.BASE_URL)) {
    return next(request);
  }

  const isGuestRequest = request.url.startsWith(`${API.BASE_URL}/guest/`);

  if (isGuestRequest) {
    const guestToken = sessionStorage.getItem(GUEST_TOKEN_KEY);
    return next(
      guestToken
        ? request.clone({
            setHeaders: {
              'X-Guest-Session-Token': guestToken,
            },
          })
        : request,
    );
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
