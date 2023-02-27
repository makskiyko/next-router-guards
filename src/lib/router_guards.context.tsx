import {useRouter} from 'next/router';
import {Context, createContext, useCallback, useContext, useMemo} from 'react';
import React, {type PropsWithChildren} from 'react';

import {RouterAction, RouterGuardsRoutes, RoutesParams} from './types';

export type RouterGuardsState<TRoutesParams extends RoutesParams> = {
  routes: RouterGuardsRoutes<TRoutesParams>;
};

export type RouterGuardsProps<TRoutesParams extends RoutesParams> = PropsWithChildren<{
  routes: {[key in keyof TRoutesParams]: string};
}>;

const RouterGuardsContext = createContext<RouterGuardsState<any>>({routes: {}});

export function useRouterGuards<TRoutesParams extends RoutesParams>() {
  return useContext(RouterGuardsContext as Context<RouterGuardsState<TRoutesParams>>);
}

export const RouterGuardsProvider = <TRoutesParams extends RoutesParams>({
  children,
  routes,
}: RouterGuardsProps<TRoutesParams>) => {
  const router = useRouter();

  const replaceUrl = useCallback<
    <TRouteName extends keyof TRoutesParams>(
      route: string,
      callback: (path: string) => Promise<boolean>,
    ) => RouterAction<TRoutesParams, TRouteName>
  >(
    (route, callback) =>
      (...args) => {
        const props = args[0];
        let path = route;

        if (props) {
          Object.entries(props).forEach(([param, value]) => {
            path = path.replace(`[${param}]`, JSON.stringify(value));
          });
        }

        return callback(path);
      },
    [],
  );

  const _routes = useMemo<RouterGuardsRoutes<TRoutesParams>>(() => {
    return Object.fromEntries(
      Object.entries(routes).map(([name, route]) => {
        return [
          name,
          {
            route,
            push: replaceUrl<typeof name>(route, router.push),
            replace: replaceUrl<typeof name>(route, router.replace),
          },
        ];
      }),
    ) as unknown as RouterGuardsRoutes<TRoutesParams>;
  }, [routes]);

  return <RouterGuardsContext.Provider value={{routes: _routes}}>{children}</RouterGuardsContext.Provider>;
};
