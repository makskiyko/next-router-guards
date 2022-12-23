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
exports.ActiveGuard = void 0;
const guard_class_1 = require("../guard.class");
class ActiveGuard extends guard_class_1.Guard {
    canAccessRoute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const isActive = params.route.isActive
                ? typeof params.route.isActive === 'boolean'
                    ? params.route.isActive
                    : yield params.route.isActive(params.request)
                : true;
            return isActive ? null : params.config.defaultPage;
        });
    }
}
exports.ActiveGuard = ActiveGuard;
//# sourceMappingURL=active.guard.js.map