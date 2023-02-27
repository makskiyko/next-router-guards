import {Guard} from '../guard.class';
import {CanAccessRouteParams, CanAccessUrlResponse, RoutesParams} from '../types';
import type {NextRequest} from 'next/server';

type CanActivate = (request: NextRequest) => CanAccessUrlResponse;

type GuardRoute = {
  canActivate?: CanActivate[];
};

export class CanActivateGuard<TRoutesParams extends RoutesParams> extends Guard<TRoutesParams, {}, GuardRoute> {
  protected canAccessRoute(params: CanAccessRouteParams<TRoutesParams, {}, GuardRoute>): CanAccessUrlResponse {
    return (
      params.route.config.canActivate?.reduce<CanAccessUrlResponse>(
        (response, canActivate) => response ?? canActivate(params.request),
        null,
      ) ?? null
    );
  }
}
