import {type Dirent, existsSync, readdirSync} from 'fs';
import {autoInjectable, singleton} from 'tsyringe';

@autoInjectable()
@singleton()
export class FilesReader {
  public constructor() {}

  public isFileExists(path: string): boolean {
    return existsSync(path);
  }

  public getFilesFromDirectory(path: string): string[] {
    const files: string[] = [];

    this._readDirectory(path, (file) => files.push(file));

    return files;
  }

  private _readDirectory(path: string, onFindFile: (file: string) => void): void {
    readdirSync(path, {withFileTypes: true}).forEach((file: Dirent) => {
      if (file.isFile()) {
        onFindFile(path + '/' + file.name);
        return;
      }

      if (file.isDirectory()) {
        this._readDirectory(path + '/' + file.name, onFindFile);
      }
    });
  }
}
