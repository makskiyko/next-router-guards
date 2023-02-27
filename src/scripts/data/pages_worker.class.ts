import {autoInjectable, singleton} from 'tsyringe';
import {FilesReader} from '/scripts/shared/files_reader.class';
import {Page} from '/scripts/shared/page.class';

@autoInjectable()
@singleton()
export class Pages {
  private readonly _nextPages = ['_app', '_document', '_error'];
  private _pages: Page[] = [];

  public constructor(private readonly _filesReader: FilesReader) {}

  public generateRoutes(config: ConfigParams): boolean {
    this._getPages();

    console.log({pages: this._pages});

    return true;
  }

  private _getPages(): void {
    this._pages = this._filesReader.getPages('./pages').filter((page) => !this._nextPages.includes(page.path));
  }
}
