export declare type Props = {[key: string]: any};

export declare type RoutesParams = {readonly [key: string]: null | Props};

export declare type RouteUrl = string;

export declare type CanAccessUrlResponse =
  | string
  | null
  | import('next/server').NextResponse
  | Promise<string | null | import('next/server').NextResponse>;

export declare type GuardRoute<TGuardRouteProps extends Props> = {
  route: string;
  config: TGuardRouteProps;
};

export declare type CanAccessRouteParams<
  TRoutes extends RoutesParams,
  TConfigProps extends Props,
  TGuardRouteProps extends Props,
> = {
  request: import('next/server').NextRequest;
  route: GuardRoute<TGuardRouteProps>;
  config: GuardsConfig<TRoutes, TConfigProps, TGuardRouteProps>;
};

export declare type CanAccessDefaultRouteParams<
  TRoutes extends RoutesParams,
  TConfigProps extends Props,
  TGuardRouteProps extends Props,
> = Omit<CanAccessRouteParams<TRoutes, TConfigProps, TGuardRouteProps>, 'route'>;

export declare type GuardParams<
  TRoutesParams extends RoutesParams,
  TConfigProps extends Props,
  TGuardRouteProps extends Props,
> = {
  routes: {[key in keyof TRoutesParams]: string};
  config: GuardsConfig<TRoutesParams, TConfigProps, TGuardRouteProps>;
};

export declare type GuardsConfig<
  TRoutesParams extends RoutesParams,
  TConfigProps extends Props,
  TGuardRouteProps extends Props,
> = {
  routes: {[key in keyof TRoutesParams]: TGuardRouteProps};
  urlRegexp?: RegExp;
} & (TConfigProps extends void ? {} : TConfigProps);

export type RouterActionArguments<
  TRoutesParams extends RoutesParams,
  TRouteName extends keyof TRoutesParams,
  TParams = TRoutesParams[TRouteName],
> = TParams extends null ? [] : [params: TParams];

export type RouterAction<TRoutesParams extends RoutesParams, TRouteName extends keyof TRoutesParams> = (
  ...args: RouterActionArguments<TRoutesParams, TRouteName>
) => Promise<boolean>;

export type RouterGuardsRoutes<TRoutesParams extends RoutesParams> = {
  [key in keyof TRoutesParams]: {
    route: string;
    push: RouterAction<TRoutesParams, key>;
    replace: RouterAction<TRoutesParams, key>;
  };
};
