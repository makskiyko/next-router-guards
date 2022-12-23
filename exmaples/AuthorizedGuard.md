```ts
import {AuthorizedGuard} from 'next-router-guards';

export const routesConfig = new AuthorizedGuard({
  defaultPublicRoute: '/login',
  defaultPrivateRoute: '/',
  checkAuthorized: (request) => request.cookies.has('token'),
  routes: {
    login: {route: '/login', isPublic: true},
    home: {route: '/', isPublic: false},
    cart: {route: '/cart', isPublic: false},
  },
});
```