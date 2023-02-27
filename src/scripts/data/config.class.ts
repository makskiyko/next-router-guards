import {cosmiconfig} from 'cosmiconfig';
import {autoInjectable, singleton} from 'tsyringe';

import {FilesWriter} from './files_writer.class';
import {Inquirer} from './inquirer.class';

export class ConfigError {}

@autoInjectable()
@singleton()
export class Config {
  private readonly _requiredFields: (keyof ConfigParams)[] = ['ts', 'writeMiddleware', 'routesPath'];
  private _config: CosmiconfigResult = null;

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
      this._config = await cosmiconfig('nrg').search();
    } catch (error) {}
  }

  private async _createConfig(): Promise<boolean> {
    try {
      this._inquirer.print('No valid config found. Please, create them.');
      const ts: boolean = await this._promptTs();
      const writeMiddleware: boolean = await this._promptWriteMiddleware();
      const routesPath: string = await this._promptRoutesPath();

      this._filesWriter.writeJSON({
        path: '.nrgrc.json',
        content: {ts, writeMiddleware, routesPath},
      });

      return true;
    } catch (error) {
      this._inquirer.error('Please try to create config again');
      return false;
    }
  }

  private _validate(): ConfigError | null {
    if (!this._config?.config || this._config.isEmpty) {
      return new ConfigError();
    }

    const missedFields: (keyof ConfigParams)[] = this._requiredFields.filter(
      (field) => !(field in this._config!.config),
    );

    if (missedFields.length) {
      return new ConfigError();
    }

    if (
      typeof this._config.config.ts !== 'boolean' ||
      typeof this._config.config.writeMiddleware !== 'boolean' ||
      typeof this._config.config.routesPath !== 'string' ||
      !this._config.config.routesPath.match(/\.js|ts$/)
    ) {
      return new ConfigError();
    }

    return null;
  }

  private async _promptTs(): Promise<boolean> {
    const {ts} = await this._inquirer.prompt<{ts: boolean}>([
      {
        name: 'ts',
        message: 'Do you want to use ts?',
        type: 'confirm',
      },
    ]);

    return ts;
  }

  private async _promptWriteMiddleware(): Promise<boolean> {
    const {writeMiddleware} = await this._inquirer.prompt<{writeMiddleware: boolean}>([
      {
        name: 'writeMiddleware',
        message: "Do you want to create middleware.ts if it's doesn't exists?",
        type: 'confirm',
      },
    ]);

    return writeMiddleware;
  }

  private async _promptRoutesPath(): Promise<string> {
    const {routesPath} = await this._inquirer.prompt<{routesPath: string}>([
      {
        name: 'routesPath',
        message: 'Please specify routes path (example: ./core/config/routes.ts)',
        type: 'input',
      },
    ]);

    if (!routesPath.match(/\.js|ts$/)) {
      this._inquirer.error('File must have an extension');
      throw new ConfigError();
    }

    return routesPath;
  }
}
