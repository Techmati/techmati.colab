import { firstValueFrom, isObservable, Observable } from 'rxjs';

type SuccessResult<T> = readonly [T, null];
type ErrorResult<E = Error> = readonly [null, E];

export type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T> | Observable<T>,
): Promise<Result<T, E>> {
  try {
    if (isObservable(promise)) promise = firstValueFrom(promise);
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
}
