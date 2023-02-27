import {autoInjectable, singleton} from 'tsyringe';

import {Config} from './config.class';
import {FilesReader} from './files_reader.class';

@autoInjectable()
@singleton()
export class App {
  public constructor(private readonly _config: Config, private readonly _filesWorker: FilesReader) {}

  public async start(): Promise<void> {
    const isConfigInitialized = await this._config.initializeConfig();

    if (!isConfigInitialized) return;

    const pages = this._filesWorker.getPages();
    console.log('pages', pages);
  }
}
