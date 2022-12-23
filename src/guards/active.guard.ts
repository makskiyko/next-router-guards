import type {NextRequest} from 'next/server';

import {Guard} from '../guard.class';

type ActiveGuardRoute = {
  isActive?: boolean | ((request: NextRequest) => boolean) | ((request: NextRequest) => Promise<boolean>);
};

type ActiveGuardConfigProps = {
  defaultPage: RouteUrl;
};

export class ActiveGuard extends Guard<ActiveGuardConfigProps, ActiveGuardRoute> {
  protected async canAccessRoute(
    params: CanAccessRouteParams<ActiveGuardConfigProps, ActiveGuardRoute>,
  ): Promise<string | null> {
    const isActive: boolean = params.route.isActive
      ? typeof params.route.isActive === 'boolean'
        ? params.route.isActive
        : await params.route.isActive(params.request)
      : true;

    return isActive ? null : params.config.defaultPage;
  }
}
