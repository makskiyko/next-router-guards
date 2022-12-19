"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const guard_class_1 = require("../guard.class");
class RolesGuard extends guard_class_1.Guard {
    canAccessRoute(params) {
        var _a;
        const role = (_a = this._getUserRole(params.request)) !== null && _a !== void 0 ? _a : params.config.unauthorizedRole;
        return this._checkRouteByRole(role, params);
    }
    canAccessDefaultRoute(params) {
        return params.config.defaultPages[params.config.unauthorizedRole];
    }
    _checkRouteByRole(role, params) {
        const isRoleIncludes = Array.isArray(params.route.roles)
            ? params.route.roles.includes(role)
            : params.route.roles === role;
        return isRoleIncludes ? null : params.config.defaultPages[role];
    }
    _getUserRole(request) {
        return request.cookies.get(this.config.roleStorageKey);
    }
}
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map