'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', {value: true});
exports.Guard = void 0;
const server_1 = require('next/server');
class Guard {
  constructor(config) {
    this.config = config;
    this.routes = Object.fromEntries(Object.entries(config.routes).map(([key, route]) => [key, route.route]));
  }
  accessRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
      const url = request.nextUrl.clone();
      const externalUrlRegexp = new RegExp(/(?=api|static|public|images|_next|fonts|favicon.ico)/);
      const isExternalRequest = externalUrlRegexp.test(url.pathname);
      if (isExternalRequest) {
        return server_1.NextResponse.next();
      }
      const redirectedUrl = yield this._accessUrl(request);
      return redirectedUrl
        ? server_1.NextResponse.redirect(new URL(redirectedUrl, request.url))
        : server_1.NextResponse.next();
    });
  }
  _accessUrl(request) {
    const url = request.nextUrl.clone();
    for (const route of Object.values(this.config.routes)) {
      const isPathSame = this._checkPathEqual(url.pathname, route.route);
      if (isPathSame) {
        return this.canAccessRoute({request, route, config: this.config});
      }
    }
    if (!this.canAccessDefaultRoute) {
      throw new Error('Страница не найдена в настройках');
    }
    return this.canAccessDefaultRoute({request, config: this.config});
  }
  _checkPathEqual(pathFromUrl, pathFromConfig) {
    const pathFromUrlItems = pathFromUrl.split('/');
    const pathFromConfigItems = pathFromConfig.split('/');
    return (
      pathFromUrlItems.length === pathFromConfigItems.length &&
      pathFromUrlItems.every((path, index) => ['*', path].includes(pathFromConfigItems[index]))
    );
  }
}
exports.Guard = Guard;
//# sourceMappingURL=guard.class.js.map
