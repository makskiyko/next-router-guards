import type {NextRequest} from 'next/server';

import {Guard} from '/src';

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

export class RolesGuard<TRoles extends string> extends Guard<RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>> {
  protected canAccessRoute(
    params: CanAccessRouteParams<RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>,
  ): CanAccessUrlResponse {
    const role = this._getUserRole(params.request) ?? params.config.unauthorizedRole;

    return this._checkRouteByRole(role, params);
  }

  public canAccessDefaultRoute(
    params: CanAccessDefaultRouteParams<RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>,
  ): CanAccessUrlResponse {
    return params.config.defaultPages[params.config.unauthorizedRole];
  }

  private _checkRouteByRole(
    role: TRoles,
    params: CanAccessRouteParams<RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>,
  ): CanAccessUrlResponse {
    const isRoleIncludes = Array.isArray(params.route.roles)
      ? params.route.roles.includes(role)
      : params.route.roles === role;

    return isRoleIncludes ? null : params.config.defaultPages[role];
  }

  private _getUserRole(request: NextRequest): TRoles | undefined {
    return request.cookies.get(this.config.roleStorageKey) as TRoles | undefined;
  }
}
