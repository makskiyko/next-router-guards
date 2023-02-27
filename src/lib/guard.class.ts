import {NextRequest, NextResponse} from 'next/server';

export interface Guard<TRoutes extends Routes, TConfigProps extends Props, TGuardRouteProps extends Props> {
  routes: TRoutes;
  config: GuardsConfig<TRoutes, TConfigProps, TGuardRouteProps>;
  urlRegexp: RegExp;

  resolveRequest(request: NextRequest): CanAccessUrlResponse;
  accessRequest(request: NextRequest): Promise<NextResponse>;
  canAccessDefaultRoute?(
    params: CanAccessDefaultRouteParams<TRoutes, TConfigProps, TGuardRouteProps>,
  ): CanAccessUrlResponse;
}

export abstract class Guard<TRoutes extends Routes, TConfigProps extends Props, TGuardRouteProps extends Props> {
  public routes: TRoutes;
  public config: GuardsConfig<TRoutes, TConfigProps, TGuardRouteProps>;
  public urlRegexp: RegExp;

  public constructor({routes, config}: GuardParams<TRoutes, TConfigProps, TGuardRouteProps>) {
    this.config = config;
    this.routes = routes;
    this.urlRegexp = config.urlRegexp ?? new RegExp(/(?!api|static|public|images|_next|fonts|favicon.ico)/);
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
    params: CanAccessRouteParams<TRoutes, TConfigProps, TGuardRouteProps>,
  ): CanAccessUrlResponse;

  private _accessUrl(request: NextRequest): CanAccessUrlResponse {
    const url = request.nextUrl.clone();

    for (const [routeName, route] of Object.entries(this.routes)) {
      const isPathSame = this._checkPathEqual(url.pathname, route.route);

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
    const pathFromUrlItems = pathFromUrl.split('/');
    const pathFromConfigItems = pathFromConfig.split('/');

    return (
      pathFromUrlItems.length === pathFromConfigItems.length &&
      pathFromUrlItems.every((path, index) => ['*', path].includes(pathFromConfigItems[index]))
    );
  }
}
