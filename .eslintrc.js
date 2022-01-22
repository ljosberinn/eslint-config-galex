const { createConfig } = require('./dist/createConfig');

const config = createConfig();
console.log(config);

module.exports = config;
