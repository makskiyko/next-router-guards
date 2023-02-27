import {writeFile} from 'fs';
import type {PathOrFileDescriptor, WriteFileOptions} from 'fs';
import {autoInjectable, singleton} from 'tsyringe';

@autoInjectable()
@singleton()
export class FilesWriter {
  public constructor() {}

  public writeFile({
    content,
    path,
    options,
  }: {
    content: string;
    path: PathOrFileDescriptor;
    options: WriteFileOptions;
  }): void {
    writeFile(path, content, options, () => {});
  }

  public writeJSON({content, path}: {content: any; path: PathOrFileDescriptor}): void {
    this.writeFile({path, content: JSON.stringify(content, null, 2), options: 'utf-8'});
  }
}
