import { Guard } from '../guard.class';
declare type RoleGuardRoute<TRoles extends string> = {
    roles: TRoles | TRoles[];
};
declare type RoleGuardConfigProps<TRoles extends string> = {
    defaultPages: {
        [key in TRoles]: RouteUrl;
    };
    unauthorizedRole: TRoles;
    roleStorageKey: string;
};
export declare class RolesGuard<TRoles extends string> extends Guard<RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>> {
    protected canAccessRoute(params: CanAccessRouteParams<RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>): CanAccessUrlResponse;
    canAccessDefaultRoute(params: CanAccessDefaultRouteParams<RoleGuardConfigProps<TRoles>, RoleGuardRoute<TRoles>>): CanAccessUrlResponse;
    private _checkRouteByRole;
    private _getUserRole;
}
export {};
