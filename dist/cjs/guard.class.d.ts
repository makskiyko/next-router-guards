import {NextRequest, NextResponse} from 'next/server';
export interface Guard<
  TConfigProps extends {
    [key: string]: any;
  } | void,
  TGuardRoute extends {
    [key: string]: any;
  } | void = void,
> {
  config: GuardsConfig<TConfigProps, TGuardRoute>;
  routes: {
    [key: string]: RouteUrl;
  };
  canAccessDefaultRoute?(params: CanAccessDefaultRouteParams<TConfigProps, TGuardRoute>): CanAccessUrlResponse;
}
export declare abstract class Guard<
  TConfigProps extends {
    [key: string]: any;
  } | void,
  TGuardRoute extends {
    [key: string]: any;
  } | void = void,
> {
  config: GuardsConfig<TConfigProps, TGuardRoute>;
  routes: {
    [key: string]: RouteUrl;
  };
  constructor(config: GuardsConfig<TConfigProps, TGuardRoute>);
  accessRequest(request: NextRequest): Promise<NextResponse>;
  protected abstract canAccessRoute(params: CanAccessRouteParams<TConfigProps, TGuardRoute>): CanAccessUrlResponse;
  private _accessUrl;
  private _checkPathEqual;
}
