# next-router-guards [![NPM Module](https://img.shields.io/npm/v/form-data.svg)](https://www.npmjs.com/package/next-router-guards)

A library for secure routes in your web project.

The security depend on next [middleware](https://nextjs.org/docs/advanced-features/middleware), so it improve performance.

## Requirements

This package has the following peer dependencies:

- [React](https://reactjs.org/) v18.2.0+
- [Next](https://nextjs.org/) v13.0.7+

## Install
```
npm i next-router-guards
```

## Usage
Here is a very basic example of how to use Next Router Guards.

### Use exists guards.
You can see examples of guards in [/examples](https://github.com/makskiyko/next-router-guards/tree/master/exmaples).

```ts
// /core/config/routes.config.ts

import {ActiveGuard} from 'next-router-guards';

export const routesConfig = new ActiveGuard({
  routes: {
    home: {route: '/'},
    test: {route: '/test', isActive: (request) => request.cookies.has('is_testing_user')},
  },
  defaultPage: '/',
});
```

### BE SURE to write this code in the root of your project in `middleware.ts`.
```ts
// /middleware.ts

import type {NextRequest} from 'next/server';

import {routesConfig} from '/core/config/routes.config.ts';

export async function middleware(request: NextRequest) {
  return routesConfig.accessRequest(request);
}
```

### Custom guard.
If you want to create your guard with custom logic:

1. Create new class extends from `Guard` with 2 generic params: (`TConfigProps` - config of your router. `TGuardRoute` - config of your routes).
2. Override `canAccessRoute` method to provide your logic.
3. You can also override `canAccessDefaultRoute` if you need it.
4. Make instance from your class with filled config.
5. Return `accessRequest` method of your instance in `middleware` function in `middleware.ts`.

Example:
```ts
// /core/services/active.guard.service.ts

import {Guard} from 'next-router-guards';
import type {CanAccessRouteParams, RouteUrl} from 'next-router-guards';
import {NextRequest} from 'next/server';

type ActiveGuardRoute = {
  isActive?: boolean | ((request: NextRequest) => boolean) | ((request: NextRequest) => Promise<boolean>);
};

type ActiveGuardConfigProps = {
  defaultPage: RouteUrl;
};

export class ActiveGuard extends Guard<ActiveGuardConfigProps, ActiveGuardRoute> {
  protected async canAccessRoute(
    params: CanAccessRouteParams<ActiveGuardConfigProps, ActiveGuardRoute>,
  ): Promise<string | null> {
    const isActive: boolean = params.route.isActive
      ? typeof params.route.isActive === 'boolean'
        ? params.route.isActive
        : await params.route.isActive(params.request)
      : true;

    return isActive ? null : params.config.defaultPage;
  }
}
```
```ts
import {ActiveGuard} from '/core/services';

export const routesConfig = new ActiveGuard({
  routes: {
    home: {route: '/'},
    test: {route: '/test', isActive: (request) => request.cookies.has('is_testing_user')},
  },
  defaultPage: '/',
});
```
```ts
// /middleware.ts

import type {NextRequest} from 'next/server';

import {routesConfig} from '/core/config';

export async function middleware(request: NextRequest) {
  return routesConfig.accessRequest(request);
}
```

## License
`next-router-guards` is released under the [MIT](License) license.