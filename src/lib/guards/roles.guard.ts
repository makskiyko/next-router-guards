import {Guard} from '../guard.class';
import {
  CanAccessDefaultRouteParams,
  CanAccessRouteParams,
  CanAccessUrlResponse,
  RoutesParams,
  RouteUrl,
} from '../types';
import type {NextRequest} from 'next/server';

type RoleGuardRoute<TRoles extends string | number> = {
  roles: TRoles | TRoles[];
};

type RoleGuardConfigProps<TRoles extends string | number> = {
  defaultPages: {
    [key in TRoles]: RouteUrl;
  };
  unauthorizedRole: TRoles;
  getUserRole: (request: NextRequest) => TRoles;
};

export class RolesGuard<TRoutesParams extends RoutesParams, TRoles extends string | number> extends Guard<
  TRoutesParams,
  RoleGuardConfigProps<TRoles>,
  RoleGuardRoute<TRoles>
> {
  protected canAccessRoute(
    params: CanAccessRouteParams<TRoutesParams, RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>,
  ): CanAccessUrlResponse {
    const role = this.config.getUserRole(params.request);

    return this._checkRouteByRole(role, params);
  }

  public canAccessDefaultRoute(
    params: CanAccessDefaultRouteParams<TRoutesParams, RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>,
  ): CanAccessUrlResponse {
    const role = this.config.getUserRole(params.request);

    return params.config.defaultPages[role];
  }

  private _checkRouteByRole(
    role: TRoles,
    params: CanAccessRouteParams<TRoutesParams, RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>,
  ): CanAccessUrlResponse {
    const isRoleIncludes = Array.isArray(params.route.config.roles)
      ? params.route.config.roles.includes(role)
      : params.route.config.roles === role;

    return isRoleIncludes ? null : params.config.defaultPages[role];
  }
}
