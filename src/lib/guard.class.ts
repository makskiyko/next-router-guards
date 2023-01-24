import {NextRequest, NextResponse} from 'next/server';

export interface Guard<
  TConfigProps extends {[key: string]: any} | void,
  TGuardRoute extends {[key: string]: any} | void = void,
> {
  config: GuardsConfig<TConfigProps, TGuardRoute>;
  routes: {[key: string]: RouteUrl};

  canAccessDefaultRoute?(params: CanAccessDefaultRouteParams<TConfigProps, TGuardRoute>): CanAccessUrlResponse;
}

export abstract class Guard<
  TConfigProps extends {[key: string]: any} | void,
  TGuardRoute extends {[key: string]: any} | void = void,
> {
  public config: GuardsConfig<TConfigProps, TGuardRoute>;
  public routes: {[key: string]: RouteUrl};

  public constructor(config: GuardsConfig<TConfigProps, TGuardRoute>) {
    this.config = config;

    this.routes = Object.fromEntries(Object.entries(config.routes).map(([key, route]) => [key, route.route]));
  }

  public async accessRequest(request: NextRequest): Promise<NextResponse> {
    const url = request.nextUrl.clone();

    const externalUrlRegexp = new RegExp(/(?=api|static|public|images|_next|fonts|favicon.ico)/);
    const isExternalRequest = externalUrlRegexp.test(url.pathname);

    if (isExternalRequest) {
      return NextResponse.next();
    }

    const redirectedUrl = await this._accessUrl(request);

    return redirectedUrl ? NextResponse.redirect(new URL(redirectedUrl, request.url)) : NextResponse.next();
  }

  protected abstract canAccessRoute(params: CanAccessRouteParams<TConfigProps, TGuardRoute>): CanAccessUrlResponse;

  private _accessUrl(request: NextRequest): CanAccessUrlResponse {
    const url = request.nextUrl.clone();

    for (const route of Object.values(this.config.routes)) {
      const isPathSame = this._checkPathEqual(url.pathname, route.route);

      if (isPathSame) {
        return this.canAccessRoute({request, route, config: this.config});
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
