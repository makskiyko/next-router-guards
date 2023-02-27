import {Guard} from '../guard.class';
import type {NextRequest} from 'next/server';

type RoleGuardRoute<TRoles extends string> = {
  roles: TRoles | TRoles[];
};

type RoleGuardConfigProps<TRoles extends string> = {
  defaultPages: {
    [key in TRoles]: RouteUrl;
  };
  unauthorizedRole: TRoles;
  roleStorageKey: string;
};

export class RolesGuard<TRoutes extends Routes, TRoles extends string> extends Guard<
  Routes,
  RoleGuardConfigProps<TRoles>,
  RoleGuardRoute<TRoles>
> {
  protected canAccessRoute(
    params: CanAccessRouteParams<Routes, RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>,
  ): CanAccessUrlResponse {
    const role = this._getUserRole(params.request) ?? params.config.unauthorizedRole;

    return this._checkRouteByRole(role, params);
  }

  public canAccessDefaultRoute(
    params: CanAccessDefaultRouteParams<Routes, RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>,
  ): CanAccessUrlResponse {
    return params.config.defaultPages[params.config.unauthorizedRole];
  }

  private _checkRouteByRole(
    role: TRoles,
    params: CanAccessRouteParams<Routes, RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>,
  ): CanAccessUrlResponse {
    const isRoleIncludes = Array.isArray(params.route.config.roles)
      ? params.route.config.roles.includes(role)
      : params.route.config.roles === role;

    return isRoleIncludes ? null : params.config.defaultPages[role];
  }

  private _getUserRole(request: NextRequest): TRoles | undefined {
    return request.cookies.get(this.config.roleStorageKey)?.value as TRoles | undefined;
  }
}
