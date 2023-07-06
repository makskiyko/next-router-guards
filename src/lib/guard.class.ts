import {NextRequest, NextResponse} from 'next/server';

import {
  CanAccessDefaultRouteParams,
  CanAccessRouteParams,
  CanAccessUrlResponse,
  GuardParams,
  GuardsConfig,
  Props,
  RoutesParams,
} from './types';

export interface Guard<TRoutesParams extends RoutesParams, TConfigProps extends Props, TGuardRouteProps extends Props> {
  routes: {[key in keyof TRoutesParams]: string};
  config: GuardsConfig<TRoutesParams, TConfigProps, TGuardRouteProps>;
  urlRegexp: RegExp;

  resolveRequest(request: NextRequest): CanAccessUrlResponse;
  accessRequest(request: NextRequest): Promise<NextResponse>;
  canAccessDefaultRoute?(
    params: CanAccessDefaultRouteParams<TRoutesParams, TConfigProps, TGuardRouteProps>,
  ): CanAccessUrlResponse;
}

export abstract class Guard<
  TRoutesParams extends RoutesParams,
  TConfigProps extends Props,
  TGuardRouteProps extends Props,
> {
  public routes: {[key in keyof TRoutesParams]: string};
  public config: GuardsConfig<TRoutesParams, TConfigProps, TGuardRouteProps>;
  public urlRegexp: RegExp;

  public constructor({config, routes}: GuardParams<TRoutesParams, TConfigProps, TGuardRouteProps>) {
    this.config = config;
    this.routes = routes;
    this.urlRegexp = config.urlRegexp ?? new RegExp(/^((?!api|static|public|images?|fonts|favicon.ico).)+$/);
  }

  public resolveRequest(request: NextRequest): CanAccessUrlResponse {
    const url = request.nextUrl.clone();

    const isRequestForGuard = this.urlRegexp.test(url.pathname);

    if (!isRequestForGuard) {
      return NextResponse.next();
    }

    return this._accessUrl(request);
  }

  public async sendResponseByCanAccess(request: NextRequest, response: CanAccessUrlResponse): Promise<NextResponse> {
    const resolvedResponse = await response;

    if (!resolvedResponse) {
      return NextResponse.next();
    }

    if (typeof resolvedResponse === 'string') {
      return NextResponse.redirect(new URL(resolvedResponse, request.url));
    }

    return resolvedResponse;
  }

  public async accessRequest(request: NextRequest): Promise<NextResponse> {
    return this.sendResponseByCanAccess(request, this.resolveRequest(request));
  }

  protected abstract canAccessRoute(
    params: CanAccessRouteParams<TRoutesParams, TConfigProps, TGuardRouteProps>,
  ): CanAccessUrlResponse;

  private _accessUrl(request: NextRequest): CanAccessUrlResponse {
    const url = request.nextUrl.clone();

    for (const [routeName, route] of Object.entries(this.routes)) {
      const isPathSame = this._checkPathEqual(url.pathname, route);

      if (isPathSame) {
        const routeConfig = this.config.routes[routeName];
        return this.canAccessRoute({request, route: {route, config: routeConfig}, config: this.config});
      }
    }

    if (!this.canAccessDefaultRoute) {
      throw new Error('Страница не найдена в настройках');
    }

    return this.canAccessDefaultRoute({request, config: this.config});
  }

  private _checkPathEqual(pathFromUrl: string, pathFromConfig: string): boolean {
    const pathFromUrlItems = pathFromUrl
      .replace(/\?.+$/, '')
      .replace('.json', '')
      .replace('/_next/data/development', '')
      .split('/');
    const pathFromConfigItems = pathFromConfig.replace(/\[.+]/g, '*').split('/');

    return (
      pathFromUrlItems.length === pathFromConfigItems.length &&
      pathFromUrlItems.every((path, index) => ['*', path].includes(pathFromConfigItems[index]))
    );
  }
}
