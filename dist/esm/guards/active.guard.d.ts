import type { NextRequest } from 'next/server';
import { Guard } from '../guard.class';
declare type ActiveGuardRoute = {
    isActive?: boolean | ((request: NextRequest) => boolean) | ((request: NextRequest) => Promise<boolean>);
};
declare type ActiveGuardConfigProps = {
    defaultPage: RouteUrl;
};
export declare class ActiveGuard extends Guard<ActiveGuardConfigProps, ActiveGuardRoute> {
    protected canAccessRoute(params: CanAccessRouteParams<ActiveGuardConfigProps, ActiveGuardRoute>): Promise<string | null>;
}
export {};
