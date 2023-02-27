import {Guard} from '../guard.class';
import type {NextRequest} from 'next/server';

type AuthorizedGuardRoute = {
  isPublic: boolean;
};

type AuthorizedGuardConfigProps = {
  defaultPublicRoute: RouteUrl;
  defaultPrivateRoute: RouteUrl;
  checkAuthorized: (request: NextRequest) => Promise<boolean> | boolean;
  isAuthorizedUserCanOpenPublicPage?: boolean; // default: true
};

export class AuthorizedGuard<TRoutes extends Routes> extends Guard<
  TRoutes,
  AuthorizedGuardConfigProps,
  AuthorizedGuardRoute
> {
  protected async canAccessRoute(
    params: CanAccessRouteParams<TRoutes, AuthorizedGuardConfigProps, AuthorizedGuardRoute>,
  ): Promise<string | null> {
    const isAuthorized = await params.config.checkAuthorized(params.request);

    if (params.route.config.isPublic && isAuthorized && params.config.isAuthorizedUserCanOpenPublicPage === false) {
      return params.config.defaultPrivateRoute;
    }

    if (!params.route.config.isPublic && !isAuthorized) {
      return params.config.defaultPublicRoute;
    }

    return null;
  }
}
