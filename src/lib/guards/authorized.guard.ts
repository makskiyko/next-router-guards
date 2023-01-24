import type {NextRequest} from 'next/server';

import {Guard} from '../guard.class';

type AuthorizedGuardRoute = {
  isPublic: boolean;
};

type AuthorizedGuardConfigProps = {
  defaultPublicRoute: RouteUrl;
  defaultPrivateRoute: RouteUrl;
  checkAuthorized: (request: NextRequest) => Promise<boolean> | boolean;
  isAuthorizedUserCanOpenPublicPage?: boolean; // default: true
};

export class AuthorizedGuard extends Guard<AuthorizedGuardConfigProps, AuthorizedGuardRoute> {
  protected async canAccessRoute(
    params: CanAccessRouteParams<AuthorizedGuardConfigProps, AuthorizedGuardRoute>,
  ): Promise<string | null> {
    const isAuthorized = await params.config.checkAuthorized(params.request);

    if (params.route.isPublic && isAuthorized && params.config.isAuthorizedUserCanOpenPublicPage === false) {
      return params.config.defaultPrivateRoute;
    }

    if (!params.route.isPublic && !isAuthorized) {
      return params.config.defaultPublicRoute;
    }

    return null;
  }
}
