import { Guard } from '../guard.class';
export class RolesGuard extends Guard {
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
        var _a;
        return (_a = request.cookies.get(this.config.roleStorageKey)) === null || _a === void 0 ? void 0 : _a.value;
    }
}
//# sourceMappingURL=roles.guard.js.map