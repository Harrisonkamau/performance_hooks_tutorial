// Container for environments
let environments = {};

environments.staging = {
  port: 4000,
  baseUrl: 'http://localhost:4000'
};

environments.production = {
  port: 5000,
  baseUrl: 'http://localhost:5000'
};

// get the current environment
const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// determine which env to export, if not specified, default to staging
const envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

module.exports = envToExport;
