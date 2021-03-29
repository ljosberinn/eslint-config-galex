// const { createConfig } = require('eslint-config-galex/src/createConfig');
const { createConfig } = require('../../src/createConfig');

module.exports = {
  ...createConfig(),
  // only necessary because this example is not on the top level of the repository
  root: true,
};
