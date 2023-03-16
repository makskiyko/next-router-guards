```ts
import {RolesGuard} from 'next-router-guards';

import {routes, type RoutesParams} from './routes.g';

export enum Roles {
  Guest = 'guest',
  User = 'user'
}

export const routesConfig = new RolesGuard<RoutesParams, Roles>({
  routes,
  config: {
    routes: {
      index: {roles: [Roles.Guest, Roles.User]},
      public: {roles: [Roles.Guest, Roles.User]},
      private: {roles: [Roles.User]},
      userId: {roles: [Roles.User]},
    },
    defaultPages: {
      [Roles.Guest]: routes.public,
      [Roles.User]: routes.private,
    },
    unauthorizedRole: Roles.Guest,
    getUserRole: (request) => (request.cookies.get('role')?.value as Roles | undefined) ?? Roles.Guest,
  },
});

```