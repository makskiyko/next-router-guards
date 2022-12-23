```ts
export enum UserRole {
  DISTRIBUTOR = 'distributor',
  MAIN_DISTRIBUTOR = 'main_distributor',
  MANAGER = 'manager',
  ACCOUNT_MANAGER = 'account_manager',
  GUEST = 'guest',
}

const managers: UserRole[] = [UserRole.ACCOUNT_MANAGER, UserRole.MANAGER];
const distributors: UserRole[] = [UserRole.DISTRIBUTOR, UserRole.MAIN_DISTRIBUTOR];

export const routesConfig = new RolesGuard<UserRole>({
  routes: {
    login: {route: '/login', roles: UserRole.GUEST},
    home: {route: '/home', roles: distributors},
    catalog: {route: '/catalog', roles: distributors},
    cart: {route: '/cart', roles: distributors},
    orders: {route: '/orders', roles: [...distributors, ...managers]},
    order: {route: '/orders/*', roles: [...distributors, ...managers]},
    ordersManager: {route: '/orders-manager', roles: managers},
  },
  defaultPages: {
    [UserRole.MAIN_DISTRIBUTOR]: '/home',
    [UserRole.DISTRIBUTOR]: '/home',
    [UserRole.MANAGER]: '/orders-manager',
    [UserRole.ACCOUNT_MANAGER]: '/orders-manager',
    [UserRole.GUEST]: '/login',
  },
  unauthorizedRole: UserRole.GUEST,
  roleStorageKey: 'user-role',
});
```