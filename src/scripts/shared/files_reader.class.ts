import {Dirent, readdirSync} from 'fs';
import {autoInjectable, singleton} from 'tsyringe';

import {Page} from './page.class';

@autoInjectable()
@singleton()
export class FilesReader {
  private readonly _pages: Page[] = [];

  public constructor() {}

  public getPages(path: string): Page[] {
    this._readDirectory(path);

    return this._pages;
  }

  private _readDirectory(path: string): void {
    readdirSync(path, {withFileTypes: true}).forEach((file: Dirent) => {
      if (file.isFile()) {
        const fileName = file.name.replace(/\..+/, '');

        this._pages.push(new Page(path + '/' + fileName));
        return;
      }

      if (file.isDirectory()) {
        this._readDirectory(path + '/' + file.name);
      }
    });
  }
}
