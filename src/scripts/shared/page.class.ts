import Case from 'case';

export class Page {
  public readonly path: string;

  public constructor(path: string) {
    this.path = path === '/index' ? '/' : path.replace(/\/index$/, '');
  }

  public get name(): string {
    return this.path === '/' ? 'index' : Case.camel(this.path.replace('index', ''));
  }

  public get params(): string[] | null {
    return this.path.match(/(?<=\[).+?(?=\])/g);
  }
}
