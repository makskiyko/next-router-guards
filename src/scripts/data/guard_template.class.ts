import {autoInjectable, singleton} from 'tsyringe';
import {relative} from 'path';

import {Page} from '../shared';

@autoInjectable()
@singleton()
export class GuardTemplate {
  private readonly _templates: {[key in GuardVariant]: (config: ConfigParams, pages: Page[]) => string} = {
    active: (config, pages) => `import {ActiveGuard} from 'next-router-guards';

import {routes${config.useTs ? ', type RoutesParams' : ''}} from '${this._getPath(config)}';

export const routesConfig = new ActiveGuard${config.useTs ? '<RoutesParams>' : ''}({
  routes,
  config: {
    routes: {
      ${this._generateRoutes(pages, '{isActive: INSERT_IS_ACTIVE}')}
    },
    defaultPage: INSERT_DEFAULT_PAGE,
  },
});

`,
    roles: (config, pages) => `import {RolesGuard} from 'next-router-guards';

import {routes${config.useTs ? ', type RoutesParams' : ''}} from '${this._getPath(config)}';

export const routesConfig = new RolesGuard${config.useTs ? '<RoutesParams, INSERT_TYPE>' : ''}({
  routes,
  config: {
    routes: {
      ${this._generateRoutes(pages, '{roles: INSERT_ROLES}')}
    },
    defaultPages: INSERT_DEFAULT_PAGES,
    unauthorizedRole: INSERT_UNAUTORIZED_ROLE,
    getUserRole: INSERT_GET_USER_ROLE_FUNCTION,
  },
});

`,
    can_activate: (config, pages) => `import {CanActivateGuard} from 'next-router-guards';

import {routes${config.useTs ? ', type RoutesParams' : ''}} from '${this._getPath(config)}';

export const routesConfig = new CanActivateGuard${config.useTs ? '<RoutesParams>' : ''}({
  routes,
  config: {
    routes: {
      ${this._generateRoutes(pages, '{canActivate: INSERT_CAN_ACTIVATE_FUNCTIONS}')}
    },
  },
});

`,
    authorized: (config, pages) => `import {AuthorizedGuard} from 'next-router-guards';

import {routes${config.useTs ? ', type RoutesParams' : ''}} from '${this._getPath(config)}';

export const routesConfig = new AuthorizedGuard${config.useTs ? '<RoutesParams>' : ''}({
  routes,
  config: {
    routes: {
      ${this._generateRoutes(pages, '{isPublic: INSERT_IS_PUBLIC}')}
    },
    defaultPublicRoute: INSERT_DEFAULT_PUBLIC_ROUTE,
    defaultPrivateRoute: INSERT_DEFAULT_PRIVATE_ROUTE,
    checkAuthorized: INSERT_CHECK_AUTHORIZED_FUNCTION,
  },
});

`,
  };

  public constructor() {}

  private _generateRoutes(pages: Page[], text: string): string {
    return `${pages.map((page) => `${page.name}: ${text},`).join('\n      ')}`;
  }

  private _getPath(config: ConfigParams): string {
    return relative(config.routesConfigPath!.replace(/(\/[^\/]+$)/, ''), config.routesPath)
      .replace(/\.(ts|js)$/, '')
      .replace(/^(?=\w)/, './');
  }

  public generateTemplate(config: ConfigParams, pages: Page[]): string {
    if (!config.guard) {
      throw new Error('Pass guard type for generate routes config');
    }

    return this._templates[config.guard](config, pages);
  }
}
