import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const contributorContextGuard: CanActivateFn = async () => {
  const contributorContextService = inject(ContributorContextService);
  const router = inject(Router);

  try {
    await contributorContextService.ensureActiveAsync();
    return true;
  } catch {
    return router.createUrlTree(['/']);
  }
};
