import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GuestService } from '../service/guest/guest.service';

export const authenticationGuard: CanActivateFn = async () => {
  const authenticationService = inject(AuthenticationService);
  const guestService = inject(GuestService);
  const router = inject(Router);

  await authenticationService.whenInitialized();
  console.log(
    'authenticationGuard',
    authenticationService.isAuthenticated(),
    guestService.isGuest(),
  );

  return authenticationService.isAuthenticated() || guestService.isGuest()
    ? true
    : router.createUrlTree(['/']);
};
