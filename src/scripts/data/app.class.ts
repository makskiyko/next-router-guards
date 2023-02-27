import {PagesWorker, Config} from '../data';
import {autoInjectable, singleton} from 'tsyringe';

@autoInjectable()
@singleton()
export class App {
  public constructor(private readonly _config: Config, private readonly _pagesWorker: PagesWorker) {}

  public async start(): Promise<void> {
    const isConfigInitialized = await this._config.initializeConfig();

    if (!isConfigInitialized || !this._config.config) return;

    this._pagesWorker.generateRoutes(this._config.config.config);
  }
}
