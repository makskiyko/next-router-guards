import {FilesWriter, Inquirer} from '../shared';
import {cosmiconfig} from 'cosmiconfig';
import {autoInjectable, singleton} from 'tsyringe';

export class ConfigError {}

type IntermediateConfigParams = {
  useTs?: boolean;
  routesPath?: string;
  useSrc?: boolean;
  useApp?: boolean;
  initializeMiddleware?: boolean;
  initializeRoutesConfig?: boolean;
  routesConfigPath?: string;
  guard?: GuardVariant;
};

@autoInjectable()
@singleton()
export class Config {
  public config: CosmiconfigResult = null;

  public constructor(private readonly _inquirer: Inquirer, private readonly _filesWriter: FilesWriter) {}

  public async initializeConfig(): Promise<boolean> {
    await this._loadConfig();
    const error = this._validate();

    if (error) {
      return this._createConfig();
    }

    return true;
  }

  private async _loadConfig(): Promise<void> {
    try {
      this.config = await cosmiconfig('nrg').search();
    } catch (error) {}
  }

  private async _createConfig(): Promise<boolean> {
    try {
      this._inquirer.print('No valid config found. Please, create them.');

      let config: ConfigParams = {
        useTs: true,
        routesPath: '',
      };

      config['useTs'] = await this._promptedFields['useTs']();

      // const responses = await Promise.all(
      //   entries.map(async ([key, promptFunction], index) => {
      //     console.log('5', index, {key, promptFunction});
      //     const configKey = key as keyof ConfigParams;
      //
      //     const result: ConfigParams[typeof configKey] = await promptFunction(config);
      //     console.log('result', {key, result});
      //
      //     const partial: Partial<ConfigParams> = {[configKey]: result};
      //
      //     config = {
      //       ...config,
      //       ...partial,
      //     };
      //
      //     return config;
      //   }),
      // );
      //
      // console.log('6', {config, responses});
      console.log({config});

      if (false) return false;

      this._filesWriter.writeJSON({
        path: '.nrgrc.json',
        content: config,
      });

      this.config = {
        config,
        filepath: './.nrgrc.json',
        isEmpty: false,
      };

      this._inquirer.success('Config successfully created!');
      return true;
    } catch (error) {
      this._inquirer.error('Please try to create config again');
      this._inquirer.print(JSON.stringify(error));
      return false;
    }
  }

  private _validate(): ConfigError | null {
    if (!this.config?.config || this.config.isEmpty) {
      return new ConfigError();
    }

    const missedFields: (keyof ConfigParams)[] = Object.keys(this._promptedFields).filter(
      (field) => !(field in this.config!.config),
    ) as (keyof ConfigParams)[];

    if (missedFields.length) {
      return new ConfigError();
    }

    if (
      typeof this.config.config.useTs !== 'boolean' ||
      typeof this.config.config.initializeMiddleware !== 'boolean' ||
      typeof this.config.config.initializeRoutesConfig !== 'boolean' ||
      typeof this.config.config.routesPath !== 'string' ||
      typeof this.config.config.routesConfigPath !== 'string' ||
      (this.config.config.initializeRoutesConfig && !this.config.config.guard)
    ) {
      return new ConfigError();
    }

    return null;
  }

  public async _promptTs(): Promise<boolean> {
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
        name: 'useSrc',
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
        message: 'Do you want to initialize routes config?',
        type: 'confirm',
      },
    ]);

    return initializeMiddleware;
  }

  private async _promptInitializeRoutesConfig(): Promise<boolean> {
    const {initializeRoutesConfig} = await this._inquirer.prompt<{initializeRoutesConfig: boolean}>([
      {
        name: 'initializeRoutesConfig',
        message: "Do you want to create middleware.ts if it's doesn't exists?",
        type: 'confirm',
      },
    ]);

    return initializeRoutesConfig;
  }

  // private async _promptRoutesConfigPath(intermediateConfig: IntermediateConfigParams): Promise<string | undefined> {
  //   if (!intermediateConfig.initializeRoutesConfig) {
  //     return undefined;
  //   }
  //
  //   const {routesConfigPath} = await this._inquirer.prompt<{routesConfigPath: string}>([
  //     {
  //       name: 'routesConfigPath',
  //       message: 'Please specify routes path (example: ./core/config/routes/routes.config.ts)',
  //       type: 'input',
  //     },
  //   ]);
  //
  //   if (!routesConfigPath.match(/\.(js|ts)$/) || routesConfigPath.match(/\.d\.ts$/)) {
  //     this._inquirer.error('File must have valid extension');
  //     throw new ConfigError();
  //   }
  //
  //   return routesConfigPath;
  // }
  //
  // private async _promptGuard(intermediateConfig: IntermediateConfigParams): Promise<GuardVariant | undefined> {
  //   if (!intermediateConfig.initializeRoutesConfig) {
  //     return undefined;
  //   }
  //
  //   const choices: GuardVariant[] = ['active', 'authorized', 'can_activate', 'roles'];
  //
  //   const {guard} = await this._inquirer.prompt<{guard: GuardVariant}>([
  //     {
  //       name: 'guard',
  //       message: 'Please chose guard for initialization',
  //       type: 'list',
  //       choices,
  //     },
  //   ]);
  //
  //   return guard;
  // }

  private _promptedFields: {
    [key in keyof ConfigParams]: (intermediateConfig?: IntermediateConfigParams) => Promise<ConfigParams[key]>;
  } = {
    useTs: this._promptTs,
    routesPath: this._promptRoutesPath,
    useSrc: this._promptSrc,
    useApp: this._promptApp,
    initializeMiddleware: this._promptInitializeMiddleware,
    initializeRoutesConfig: this._promptInitializeRoutesConfig,
    // routesConfigPath: this._promptRoutesConfigPath,
    // guard: this._promptGuard,
  };
}
