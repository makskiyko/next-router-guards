import type {NextRequest} from 'next/server';

import {Guard} from '../guard.class';

type CanActivate = (request: NextRequest) => CanAccessUrlResponse;

type GuardRoute = {
  canActivate?: CanActivate[];
};

export class CanActivateGuard extends Guard<void, GuardRoute> {
  protected canAccessRoute(params: CanAccessRouteParams<void, GuardRoute>): CanAccessUrlResponse {
    return (
      params.route.canActivate?.reduce<CanAccessUrlResponse>(
        (response, canActivate) => response ?? canActivate(params.request),
        null,
      ) ?? null
    );
  }
}
