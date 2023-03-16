import {FilesWriter, Inquirer} from '../shared';
import {cosmiconfig} from 'cosmiconfig';
import {autoInjectable, singleton} from 'tsyringe';
import {PromptConfig} from './prompt_config.class';
import {ConfigError} from './index';

@autoInjectable()
@singleton()
export class Config {
  public config: CosmiconfigResult = null;

  private _configFields: (keyof ConfigParams)[] = [
    'useTs',
    'routesPath',
    'useSrc',
    'useApp',
    'initializeMiddleware',
    'initializeRoutesConfig',
    'routesConfigPath',
    'guard',
  ];

  public constructor(
    private readonly _promptConfig: PromptConfig,
    private readonly _inquirer: Inquirer,
    private readonly _filesWriter: FilesWriter,
  ) {}

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

      const config = await this._promptConfig.promptConfig();

      await this._filesWriter.writeJSON({
        path: '.nrgrc.json',
        content: config,
      });

      this.config = {
        config,
        filepath: '.nrgrc.json',
        isEmpty: false,
      };

      this._inquirer.success('Config successfully created!');
      return true;
    } catch (error) {
      this._inquirer.error('Please try to create config again');
      return false;
    }
  }

  private _validate(): ConfigError | null {
    if (!this.config?.config || this.config.isEmpty) {
      return new ConfigError();
    }

    const missedFields: (keyof ConfigParams)[] = this._configFields.filter(
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
}
