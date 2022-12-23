'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.CanActivateGuard = void 0;
const guard_class_1 = require('../guard.class');
class CanActivateGuard extends guard_class_1.Guard {
  canAccessRoute(params) {
    return params.route.canActivate.reduce(
      (response, canActivate) => (response !== null && response !== void 0 ? response : canActivate(params.request)),
      null,
    );
  }
}
exports.CanActivateGuard = CanActivateGuard;
//# sourceMappingURL=can_activate.guard.js.map
