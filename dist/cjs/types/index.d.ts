export declare type RouteUrl = string;
export declare type CanAccessUrlResponse = string | null | Promise<string | null>;
export declare type GuardRoute<TGuardRoute extends {
    [key: string]: any;
} | void> = {
    route: RouteUrl;
} & TGuardRoute;
export declare type CanAccessRouteParams<TConfigProps extends {
    [key: string]: any;
} | void, TGuardRoute extends {
    [key: string]: any;
} | void> = {
    request: import('next/server').NextRequest;
    route: GuardRoute<TGuardRoute>;
    config: GuardsConfig<TConfigProps, TGuardRoute>;
};
export declare type CanAccessDefaultRouteParams<TConfigProps extends {
    [key: string]: any;
} | void, TGuardRoute extends {
    [key: string]: any;
} | void> = Omit<CanAccessRouteParams<TConfigProps, TGuardRoute>, 'route'>;
export declare type GuardsConfig<TConfigProps extends {
    [key: string]: any;
} | void, TGuardRoute extends {
    [key: string]: any;
} | void> = {
    routes: {
        [key: string]: GuardRoute<TGuardRoute>;
    };
} & TConfigProps;
