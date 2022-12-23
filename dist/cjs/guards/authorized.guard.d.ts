import type { NextRequest } from 'next/server';
import { Guard } from '../guard.class';
declare type AuthorizedGuardRoute = {
    isPublic: boolean;
};
declare type AuthorizedGuardConfigProps = {
    defaultPublicRoute: RouteUrl;
    defaultPrivateRoute: RouteUrl;
    checkAuthorized: (request: NextRequest) => Promise<boolean> | boolean;
    isAuthorizedUserCanOpenPublicPage?: boolean;
};
export declare class AuthorizedGuard extends Guard<AuthorizedGuardConfigProps, AuthorizedGuardRoute> {
    protected canAccessRoute(params: CanAccessRouteParams<AuthorizedGuardConfigProps, AuthorizedGuardRoute>): Promise<string | null>;
}
export {};
