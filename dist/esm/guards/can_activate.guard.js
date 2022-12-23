import { Guard } from '../guard.class';
export class CanActivateGuard extends Guard {
    canAccessRoute(params) {
        var _a, _b;
        return ((_b = (_a = params.route.canActivate) === null || _a === void 0 ? void 0 : _a.reduce((response, canActivate) => response !== null && response !== void 0 ? response : canActivate(params.request), null)) !== null && _b !== void 0 ? _b : null);
    }
}
//# sourceMappingURL=can_activate.guard.js.map