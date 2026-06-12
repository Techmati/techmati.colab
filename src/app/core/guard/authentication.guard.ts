import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authenticationGuard: CanActivateFn = async () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  await authenticationService.whenInitialized();

  return authenticationService.isAuthenticated() ? true : router.createUrlTree(['/']);
};
