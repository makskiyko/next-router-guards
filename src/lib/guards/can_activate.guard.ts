import {Guard} from '../guard.class';
import type {NextRequest} from 'next/server';

type CanActivate = (request: NextRequest) => CanAccessUrlResponse;

type GuardRoute = {
  canActivate?: CanActivate[];
};

export class CanActivateGuard<TRoutes extends Routes> extends Guard<TRoutes, {}, GuardRoute> {
  protected canAccessRoute(params: CanAccessRouteParams<TRoutes, {}, GuardRoute>): CanAccessUrlResponse {
    return (
      params.route.config.canActivate?.reduce<CanAccessUrlResponse>(
        (response, canActivate) => response ?? canActivate(params.request),
        null,
      ) ?? null
    );
  }
}
