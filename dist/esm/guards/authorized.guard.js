var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Guard } from '../guard.class';
export class AuthorizedGuard extends Guard {
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
//# sourceMappingURL=authorized.guard.js.map