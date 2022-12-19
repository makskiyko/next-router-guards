import { Guard } from '../guard.class';
export class CanActivateGuard extends Guard {
    canAccessRoute(params) {
        return params.route.canActivate.reduce((response, canActivate) => response !== null && response !== void 0 ? response : canActivate(params.request), null);
    }
}
//# sourceMappingURL=can_activate.guard.js.map