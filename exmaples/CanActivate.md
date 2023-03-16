```ts
import {CanActivateGuard} from 'next-router-guards';

import {routes, type RoutesParams} from './routes.g';

export const routesConfig = new CanActivateGuard<RoutesParams>({
  routes,
  config: {
    routes: {
      index: {canActivate: []},
      public: {canActivate: []},
      private: {canActivate: [(request) => request.cookies.has('token') ? null : routes.public]},
      userId: {canActivate: [(request) => request.cookies.has('token') ? null : routes.public]},
    },
  },
});

```
