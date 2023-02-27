declare type GuardVariant = 'active' | 'authorized' | 'can_activate' | 'roles';

declare type ConfigParams = {
  useTs: boolean;
  routesPath: string;
  useSrc?: boolean;
  useApp?: boolean;
  initializeMiddleware?: boolean;
  initializeRoutesConfig?: boolean;
  routesConfigPath?: string;
  guard?: GuardVariant;
};

declare type CosmiconfigResult = {
  config: ConfigParams;
  filepath: string;
  isEmpty?: boolean;
} | null;
