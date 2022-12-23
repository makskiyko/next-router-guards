```ts
import {ActiveGuard} from 'next-router-guards';

export const routesConfig = new ActiveGuard({
  routes: {
    home: {route: '/'},
    test: {route: '/test', isActive: (request) => request.cookies.has('is_testing_user')},
  },
  defaultPage: '/',
});
```
