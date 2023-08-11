import {autoInjectable, singleton} from 'tsyringe';

import {ConfigError} from './index';
import {Inquirer} from '../shared';

@autoInjectable()
@singleton()
export class PromptConfig {
  public config: CosmiconfigResult = null;

  public constructor(private readonly _inquirer: Inquirer) {}

  public async promptConfig(): Promise<ConfigParams> {
    const config: ConfigParams = {
      useTs: false,
      routesPath: '',
    };

    config['useTs'] = await this._promptTs();
    config['routesPath'] = await this._promptRoutesPath();
    config['useSrc'] = await this._promptSrc();
    config['useApp'] = await this._promptApp();
    config['initializeMiddleware'] = await this._promptInitializeMiddleware();
    config['initializeRoutesConfig'] = await this._promptInitializeRoutesConfig();
    config['routesConfigPath'] = await this._promptRoutesConfigPath(config);
    config['guard'] = await this._promptGuard(config);

    return config;
  }

  private async _promptTs(): Promise<boolean> {
    const {useTs} = await this._inquirer.prompt<{useTs: boolean}>([
      {
        name: 'useTs',
        message: 'Do you want to use ts?',
        type: 'confirm',
      },
    ]);

    return useTs;
  }

  private async _promptRoutesPath(): Promise<string> {
    const {routesPath} = await this._inquirer.prompt<{routesPath: string}>([
      {
        name: 'routesPath',
        message: 'Please specify routes path (example: ./core/config/routes/routes.g.ts)',
        type: 'input',
      },
    ]);

    if (!routesPath.match(/\.js|ts$/)) {
      this._inquirer.error('File must have an extension');
      throw new ConfigError();
    }

    return routesPath;
  }

  private async _promptSrc(): Promise<boolean> {
    const {useSrc} = await this._inquirer.prompt<{useSrc: boolean}>([
      {
        name: 'useSrc',
        message: 'Do you use src folder?',
        type: 'confirm',
      },
    ]);

    return useSrc;
  }

  private async _promptApp(): Promise<boolean> {
    const {useApp} = await this._inquirer.prompt<{useApp: boolean}>([
      {
        name: 'useApp',
        message: 'Do you use app folder?',
        type: 'confirm',
      },
    ]);

    return useApp;
  }

  private async _promptInitializeMiddleware(): Promise<boolean> {
    const {initializeMiddleware} = await this._inquirer.prompt<{initializeMiddleware: boolean}>([
      {
        name: 'initializeMiddleware',
        message: "Do you want to create middleware.ts if it's doesn't exists?",
        type: 'confirm',
      },
    ]);

    return initializeMiddleware;
  }

  private async _promptInitializeRoutesConfig(): Promise<boolean> {
    const {initializeRoutesConfig} = await this._inquirer.prompt<{initializeRoutesConfig: boolean}>([
      {
        name: 'initializeRoutesConfig',
        message: 'Do you want to initialize routes config?',
        type: 'confirm',
      },
    ]);

    return initializeRoutesConfig;
  }

  private async _promptRoutesConfigPath(intermediateConfig: ConfigParams): Promise<string | undefined> {
    if (!intermediateConfig.initializeRoutesConfig) {
      return undefined;
    }

    const {routesConfigPath} = await this._inquirer.prompt<{routesConfigPath: string}>([
      {
        name: 'routesConfigPath',
        message: 'Please specify routes path (example: ./core/config/routes/routes.config.ts)',
        type: 'input',
      },
    ]);

    if (!routesConfigPath.match(/\.(js|ts)$/) || routesConfigPath.match(/\.d\.ts$/)) {
      this._inquirer.error('File must have valid extension');
      throw new ConfigError();
    }

    return routesConfigPath;
  }

  private async _promptGuard(intermediateConfig: ConfigParams): Promise<GuardVariant | undefined> {
    if (!intermediateConfig.initializeRoutesConfig) {
      return undefined;
    }

    const choices: GuardVariant[] = ['active', 'authorized', 'can_activate', 'roles'];

    const {guard} = await this._inquirer.prompt<{guard: GuardVariant}>([
      {
        name: 'guard',
        message: 'Please chose guard for initialization',
        type: 'list',
        choices,
      },
    ]);

    return guard;
  }
}
