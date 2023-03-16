```ts
import {ActiveGuard} from 'next-router-guards';

import {routes, type RoutesParams} from './routes.g';

export const routesConfig = new ActiveGuard<RoutesParams>({
  routes,
  config: {
    routes: {
      index: {isActive: true},
      public: {isActive: true},
      private: {isActive: false},
      userId: {isActive: (request) => request.cookies.has('is_testing_user')},
    },
    defaultPage: routes.index,
  },
});

```
