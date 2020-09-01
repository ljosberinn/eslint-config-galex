const config = require('.');

module.exports = {
  ...config,
  env: {
    ...config.env,
    node: true,
  },
};
