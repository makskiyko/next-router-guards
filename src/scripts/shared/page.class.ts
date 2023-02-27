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

  public get textedParams(): string {
    if (!this.params) {
      return 'null';
    }

    return `{` + this.params.map((param) => param + ': any').join(', ') + '}';
  }

  public get generatedText() {
    return `{${this.name}: new Route<${this.textedParams}>({path: '${this.path}'})},`;
  }
}
