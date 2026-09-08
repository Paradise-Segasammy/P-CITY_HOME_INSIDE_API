import configuration from '../../src/config/app.config';

describe('database environment selection', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.ORACLE_HOME_ENV;
    delete process.env.ORACLE_IRDB_ENV;
    for (const [pool, dev, prod] of [['HOME', 'homedev', 'HOME'], ['IRDB', 'irdev', 'ir']]) {
      process.env[`ORACLE_${pool}_DEV_CONNECT_STRING`] = `test-host:1521/${dev}`;
      process.env[`ORACLE_${pool}_PROD_CONNECT_STRING`] = `test-host:1521/${prod}`;
      process.env[`ORACLE_${pool}_DEV_USER`] = `${pool}_dev_user`;
      process.env[`ORACLE_${pool}_PROD_USER`] = `${pool}_prod_user`;
      process.env[`ORACLE_${pool}_DEV_PASSWORD`] = 'dev-test-password';
      process.env[`ORACLE_${pool}_PROD_PASSWORD`] = 'prod-test-password';
    }
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it.each([
    ['dev', 'dev', 'homedev', 'irdev'],
    ['prod', 'prod', 'HOME', 'ir'],
    ['prod', 'dev', 'HOME', 'irdev'],
    ['dev', 'prod', 'homedev', 'ir'],
  ])('selects HOME %s and IRDB %s independently', (homeEnv, irEnv, homeDb, irDb) => {
    process.env.ORACLE_HOME_ENV = homeEnv;
    process.env.ORACLE_IRDB_ENV = irEnv;
    const { oracle } = configuration();
    expect(oracle.home.connectString).toBe(`test-host:1521/${homeDb}`);
    expect(oracle.irdb.connectString).toBe(`test-host:1521/${irDb}`);
    expect(oracle.home.user).toBe(`HOME_${homeEnv}_user`);
    expect(oracle.irdb.user).toBe(`IRDB_${irEnv}_user`);
    expect(oracle.home.password).toBe(`${homeEnv}-test-password`);
    expect(oracle.irdb.password).toBe(`${irEnv}-test-password`);
  });

  it('defaults both pools to dev', () => {
    const { oracle } = configuration();
    expect(oracle.home.env).toBe('dev');
    expect(oracle.irdb.env).toBe('dev');
  });

  it('does not inherit HOME production selection for IRDB', () => {
    process.env.ORACLE_HOME_ENV = 'prod';
    expect(configuration().oracle.irdb.connectString).toBe('test-host:1521/irdev');
  });
});
