import {existsSync, mkdir, writeFile} from 'fs';
import type {WriteFileOptions} from 'fs';
import {autoInjectable, singleton} from 'tsyringe';

@autoInjectable()
@singleton()
export class FilesWriter {
  public constructor() {}

  public isExists(path: string) {
    return existsSync(path);
  }

  public writeFile({content, path, options}: {content: string; path: string; options: WriteFileOptions}): void {
    const pathToFolder = path.replace(/(\/[^\/]+$)/, '').replace('./', '');

    if (pathToFolder && path.includes('/')) {
      const folderExist = this.isExists(pathToFolder);

      if (!folderExist) {
        mkdir(pathToFolder, {recursive: true}, () => {});
      }
    }

    writeFile(path, content, options, () => {});
  }

  public writeJSON({content, path}: {content: any; path: string}): void {
    this.writeFile({path, content: JSON.stringify(content, null, 2), options: 'utf-8'});
  }
}
