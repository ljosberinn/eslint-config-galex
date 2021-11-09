const { createConfig, getDependencies } = require('../../src/createConfig');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const config = createConfig({ root: true });

const depsPath = resolve('deps.json');
console.log('writing deps to ', depsPath);
writeFileSync(depsPath, JSON.stringify(getDependencies()));

const configCachePath = resolve('eslint-config.json');
console.log('writing config cache to ', configCachePath);
writeFileSync(configCachePath, JSON.stringify(config));

module.exports = config;
