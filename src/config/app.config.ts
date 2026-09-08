/**
 * 애플리케이션 환경 설정
 */
export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'local',
    port: Number(process.env.PORT || 3001),
    globalPrefix: process.env.GLOBAL_PREFIX || 'api',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    homeApiKey: process.env.HOME_API_KEY,
  },
  oracle: {
    home: {
      env: process.env.ORACLE_HOME_ENV || 'dev',
      user:
        (process.env.ORACLE_HOME_ENV || 'dev') === 'prod'
          ? process.env.ORACLE_HOME_PROD_USER
          : process.env.ORACLE_HOME_DEV_USER,
      password:
        (process.env.ORACLE_HOME_ENV || 'dev') === 'prod'
          ? process.env.ORACLE_HOME_PROD_PASSWORD
          : process.env.ORACLE_HOME_DEV_PASSWORD,
      connectString:
        (process.env.ORACLE_HOME_ENV || 'dev') === 'prod'
          ? process.env.ORACLE_HOME_PROD_CONNECT_STRING
          : process.env.ORACLE_HOME_DEV_CONNECT_STRING,
      poolMin: Number(process.env.ORACLE_POOL_MIN || 1),
      poolMax: Number(process.env.ORACLE_POOL_MAX || 5),
      poolIncrement: Number(process.env.ORACLE_POOL_INCREMENT || 1),
      poolTimeout: Number(process.env.ORACLE_POOL_TIMEOUT || 60),
      ociLibDir: process.env.OCI_LIB_DIR,
    },
    irdb: {
      env: process.env.ORACLE_IRDB_ENV || 'dev',
      user:
        (process.env.ORACLE_IRDB_ENV || 'dev') === 'prod'
          ? process.env.ORACLE_IRDB_PROD_USER
          : process.env.ORACLE_IRDB_DEV_USER,
      password:
        (process.env.ORACLE_IRDB_ENV || 'dev') === 'prod'
          ? process.env.ORACLE_IRDB_PROD_PASSWORD
          : process.env.ORACLE_IRDB_DEV_PASSWORD,
      connectString:
        (process.env.ORACLE_IRDB_ENV || 'dev') === 'prod'
          ? process.env.ORACLE_IRDB_PROD_CONNECT_STRING
          : process.env.ORACLE_IRDB_DEV_CONNECT_STRING,
      poolMin: Number(process.env.ORACLE_IRDB_POOL_MIN || process.env.ORACLE_POOL_MIN || 1),
      poolMax: Number(process.env.ORACLE_IRDB_POOL_MAX || process.env.ORACLE_POOL_MAX || 5),
      poolIncrement: Number(process.env.ORACLE_IRDB_POOL_INCREMENT || process.env.ORACLE_POOL_INCREMENT || 1),
      poolTimeout: Number(process.env.ORACLE_IRDB_POOL_TIMEOUT || process.env.ORACLE_POOL_TIMEOUT || 60),
      ociLibDir: process.env.OCI_LIB_DIR,
    },
  },
  home: {
    defaultBranchCd: process.env.HOME_DEFAULT_BRANCH_CD || '1000',
    channel: process.env.HOME_CHANNEL || 'WEB',
    assetBaseUrl: process.env.HOME_ASSET_BASE_URL || '',
  },
});
