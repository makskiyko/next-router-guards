"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanActivateGuard = void 0;
const guard_class_1 = require("../guard.class");
class CanActivateGuard extends guard_class_1.Guard {
    canAccessRoute(params) {
        var _a, _b;
        return ((_b = (_a = params.route.canActivate) === null || _a === void 0 ? void 0 : _a.reduce((response, canActivate) => response !== null && response !== void 0 ? response : canActivate(params.request), null)) !== null && _b !== void 0 ? _b : null);
    }
}
exports.CanActivateGuard = CanActivateGuard;
//# sourceMappingURL=can_activate.guard.js.map