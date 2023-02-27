declare type ConfigParams = {
  ts: boolean;
  writeMiddleware: boolean;
  routesPath: string;
};

declare type CosmiconfigResult = {
  config: ConfigParams;
  filepath: string;
  isEmpty?: boolean;
} | null;
