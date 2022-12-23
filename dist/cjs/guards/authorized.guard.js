"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizedGuard = void 0;
const guard_class_1 = require("../guard.class");
class AuthorizedGuard extends guard_class_1.Guard {
    canAccessRoute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAuthorized = yield params.config.checkAuthorized(params.request);
            if (params.route.isPublic && isAuthorized && params.config.isAuthorizedUserCanOpenPublicPage === false) {
                return params.config.defaultPrivateRoute;
            }
            if (!params.route.isPublic && !isAuthorized) {
                return params.config.defaultPublicRoute;
            }
            return null;
        });
    }
}
exports.AuthorizedGuard = AuthorizedGuard;
//# sourceMappingURL=authorized.guard.js.map