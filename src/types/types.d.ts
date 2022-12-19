declare type RouteUrl = string;

declare type CanAccessUrlResponse = string | null | Promise<string | null>;

declare type GuardRoute<TGuardRoute extends {[key: string]: any} | void> = {
  route: RouteUrl;
} & TGuardRoute;

declare type CanAccessRouteParams<
  TConfigProps extends {[key: string]: any} | void,
  TGuardRoute extends {[key: string]: any} | void,
> = {
  request: import('next/server').NextRequest;
  route: GuardRoute<TGuardRoute>;
  config: GuardsConfig<TConfigProps, TGuardRoute>;
};

declare type CanAccessDefaultRouteParams<
  TConfigProps extends {[key: string]: any} | void,
  TGuardRoute extends {[key: string]: any} | void,
> = Omit<CanAccessRouteParams<TConfigProps, TGuardRoute>, 'route'>;

declare type GuardsConfig<
  TConfigProps extends {[key: string]: any} | void,
  TGuardRoute extends {[key: string]: any} | void,
> = {
  routes: {[key: string]: GuardRoute<TGuardRoute>};
} & TConfigProps;
