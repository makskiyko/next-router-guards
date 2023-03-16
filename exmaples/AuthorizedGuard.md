```ts
import {AuthorizedGuard} from 'next-router-guards';

import {routes, type RoutesParams} from './routes.g';

export const routesConfig = new AuthorizedGuard<RoutesParams>({
  routes,
  config: {
    routes: {
      index: {isPublic: true},
      public: {isPublic: true},
      private: {isPublic: false},
      userId: {isPublic: false},
    },
    defaultPublicRoute: routes.public,
    defaultPrivateRoute: routes.private,
    checkAuthorized: (request) => request.cookies.has('token'),
  },
});
```
