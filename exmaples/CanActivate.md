```ts
import {CanActivateGuard} from 'next-router-guards';

const isUserUnauthorized: CanActivate = (request) => (request.cookies.has('token') ? '/' : null);
const isUserAuthorized: CanActivate = (request) => (request.cookies.has('token') ? null : '/login');
const isUserHasCartItems: CanActivate = (request) => (request.cookies.has('cartItems') ? null : '/cart');

export const routesConfig = new CanActivateGuard({
  routes: {
    login: {route: '/login', canActivate: [isUserUnauthorized]},
    home: {route: '/', canActivate: [isUserAuthorized]},
    cart: {route: '/cart', canActivate: [isUserAuthorized]},
    cartConfirm: {route: '/cart/confirm', canActivate: [isUserAuthorized, isUserHasCartItems]},
  },
});
```
