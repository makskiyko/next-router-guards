import {FilesReader, FilesWriter, Inquirer, Page} from '../shared';
import {singleton} from 'tsyringe';
import {GuardTemplate} from './guard_template.class';

@singleton()
export class PagesWorker {
  private readonly _nextPages = ['_app', '_document', '_error', 'api'];
  private _pages: Page[] = [];

  public constructor(
    private readonly _filesReader: FilesReader,
    private readonly _filesWriter: FilesWriter,
    private readonly _inquirer: Inquirer,
    private readonly _guardTemplate: GuardTemplate,
  ) {}

  public async generateRoutes(config: ConfigParams): Promise<void> {
    try {
      if (config.useApp) {
        throw new Error("next-router-guards doesn't support app directory");
      }

      await this._generateRoutes(config);
      await this._generateConfig(config);
      await this._generateMiddleware(config);
    } catch (error) {}
  }

  private _getPages(config: ConfigParams): void {
    const pagesDirectory = config.useSrc ? './src/pages' : './pages';

    const files = this._filesReader
      .getFilesFromDirectory(pagesDirectory)
      .map((file) => file.replace(pagesDirectory, '').replace(/\..+$/, ''))
      .filter((file) => !this._nextPages.includes(file.replace(/^\//, '').split('/')[0]));

    this._pages = files.map((file) => new Page(file));
  }

  private _getTypesGeneratedText(config: ConfigParams): string {
    if (config.useTs) {
      return [
        'export type RoutesParams = {',
        ...this._pages.map(
          (page) =>
            `  ${page.name}: ${
              page.params ? `{` + page.params.map((param) => param + ': INSERT_TYPE').join(', ') + '}' : 'null'
            },`,
        ),
        '};',
        '',
      ].join('\n');
    }

    return '';
  }

  private _getPagesGeneratedText(config: ConfigParams): string {
    return [
      `export const routes${config.useTs ? ': {readonly [key in keyof RoutesParams]: string}' : ''} = {`,
      this._pages.map((page) => `  ${page.name}: '${page.path}',`).join('\n'),
      '};',
      '',
    ].join('\n');
  }

  private _getGeneratedFileText(config: ConfigParams): string {
    return [this._getTypesGeneratedText(config), this._getPagesGeneratedText(config)].join('\n');
  }

  private async _generateRoutes(config: ConfigParams): Promise<void> {
    try {
      this._getPages(config);

      const generatedFileText = this._getGeneratedFileText(config);
      await this._filesWriter.writeFile({content: generatedFileText, path: config.routesPath, options: 'utf-8'});

      this._inquirer.success('Routes successfully created!');
    } catch (error) {
      this._inquirer.error('Failed to generate routes.');
      this._inquirer.print(JSON.stringify(error));
    }
  }

  private async _generateMiddleware(config: ConfigParams): Promise<void> {
    try {
      if (!config.initializeMiddleware) return;

      const isMiddleWareExists = this._filesReader.isFileExists('./middleware.ts');

      if (isMiddleWareExists) return;

      if (config.useTs) {
        await this._filesWriter.writeFile({
          content: [
            "import type {NextRequest} from 'next/server';",
            '',
            `import {routesConfig} from '${config.routesConfigPath?.replace(/\.(ts|js)$/, '')}';`,
            '',
            'export async function middleware(request: NextRequest) {',
            '  return routesConfig.accessRequest(request);',
            '}',
            '',
          ].join('\n'),
          path: './middleware.ts',
          options: 'utf-8',
        });
      } else {
        await this._filesWriter.writeFile({
          content: [
            `import {routes} from '${config.routesConfigPath?.replace(/\.(ts|js)$/, '')}';`,
            '',
            'export async function middleware(request) {',
            '  return routesConfig.accessRequest(request);',
            '}',
            '',
          ].join('\n'),
          path: './middleware.ts',
          options: 'utf-8',
        });
      }

      this._inquirer.success('Middleware successfully created!');
    } catch (error) {
      this._inquirer.error('Failed to generate Middleware.');
      this._inquirer.print(JSON.stringify(error));
    }
  }

  private async _generateConfig(config: ConfigParams): Promise<void> {
    try {
      if (!config.initializeRoutesConfig || !config.routesConfigPath) return;

      const isRoutesConfigExists = this._filesReader.isFileExists(config.routesConfigPath);

      if (isRoutesConfigExists) {
        const {overwrite} = await this._inquirer.prompt<{overwrite: boolean}>([
          {
            name: 'overwrite',
            message: 'Routes config already exists. Do you want overwrite it?',
            type: 'confirm',
          },
        ]);

        if (!overwrite) return;
      }

      await this._filesWriter.writeFile({
        content: this._guardTemplate.generateTemplate(config, this._pages),
        path: config.routesConfigPath,
        options: 'utf-8',
      });

      this._inquirer.success('Routes config successfully created!');
    } catch (error) {
      this._inquirer.error('Failed to generate routes config.');
      this._inquirer.print(JSON.stringify(error));
    }
  }
}
