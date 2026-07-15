import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';

export const contributorContextGuard: CanActivateFn = () => {
  const contributorContextService = inject(ContributorContextService);
  const router = inject(Router);

  return toObservable(contributorContextService.activeContributor).pipe(
    tap((r) => console.log(r)),
    map((activeContributor) => (activeContributor !== null ? true : router.createUrlTree(['/']))),

    tap((r) => console.log(r)),
  );
};
