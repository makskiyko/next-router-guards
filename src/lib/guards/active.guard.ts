import {Guard} from '../guard.class';
import type {NextRequest} from 'next/server';

type ActiveGuardRoute = {
  isActive?: boolean | ((request: NextRequest) => boolean) | ((request: NextRequest) => Promise<boolean>);
};

type ActiveGuardConfigProps = {
  defaultPage: RouteUrl;
};

export class ActiveGuard<TRoutes extends Routes> extends Guard<TRoutes, ActiveGuardConfigProps, ActiveGuardRoute> {
  protected async canAccessRoute(
    params: CanAccessRouteParams<TRoutes, ActiveGuardConfigProps, ActiveGuardRoute>,
  ): Promise<string | null> {
    const isActive: boolean = params.route.config.isActive
      ? typeof params.route.config.isActive === 'boolean'
        ? params.route.config.isActive
        : await params.route.config.isActive(params.request)
      : true;

    return isActive ? null : params.config.defaultPage;
  }
}
