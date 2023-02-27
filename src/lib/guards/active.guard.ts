import {Guard} from '../guard.class';
import {CanAccessRouteParams, RoutesParams, RouteUrl} from '../types';
import type {NextRequest} from 'next/server';

type ActiveGuardRoute = {
  isActive?: boolean | ((request: NextRequest) => boolean) | ((request: NextRequest) => Promise<boolean>);
};

type ActiveGuardConfigProps = {
  defaultPage: RouteUrl;
};

export class ActiveGuard<TRoutesParams extends RoutesParams> extends Guard<
  TRoutesParams,
  ActiveGuardConfigProps,
  ActiveGuardRoute
> {
  protected async canAccessRoute(
    params: CanAccessRouteParams<TRoutesParams, ActiveGuardConfigProps, ActiveGuardRoute>,
  ): Promise<string | null> {
    const isActive: boolean = params.route.config.isActive
      ? typeof params.route.config.isActive === 'boolean'
        ? params.route.config.isActive
        : await params.route.config.isActive(params.request)
      : true;

    return isActive ? null : params.config.defaultPage;
  }
}
