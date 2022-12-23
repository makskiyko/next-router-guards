import type {NextRequest} from 'next/server';
import {Guard} from '../guard.class';
declare type CanActivate = (request: NextRequest) => CanAccessUrlResponse;
declare type GuardRoute = {
  canActivate: CanActivate[];
};
export declare class CanActivateGuard extends Guard<void, GuardRoute> {
  protected canAccessRoute(params: CanAccessRouteParams<void, GuardRoute>): CanAccessUrlResponse;
}
export {};
