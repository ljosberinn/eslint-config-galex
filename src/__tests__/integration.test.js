/* eslint-disable jest/no-conditional-expect */
const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const env = {
  env: 'production',
};

const readSnapshot = folder => {
  try {
    const data = readFileSync(`integration/${folder}/results.txt`, {
      encoding: 'utf-8',
    });

    // since eslint stores absolute
    return data.replaceAll(
      `C:\\Users\\gerr.it\\Desktop\\dev\\eslint-config-galex\\integration\\${folder}`,
      resolve(`integration\\${folder}`)
    );
  } catch {
    return null;
  }
};

describe('integration tests', () => {
  test.each(['cra-js', 'cra-ts', 'next-js', 'next-ts'])('%s', folder => {
    const snapshot = readSnapshot(folder);
    const cwd = resolve('integration', folder);

    try {
      execSync('yarn lint:integration', {
        env,
        cwd,
      });
    } catch {
      if (snapshot) {
        expect(snapshot).toStrictEqual(readSnapshot(folder));
      }
    }
  });
});
