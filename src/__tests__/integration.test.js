/* eslint-disable jest/no-conditional-expect */
const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const env = {
  env: 'production',
};

describe('cra', () => {
  test.each(['js', 'ts'])('%s', type => {
    const readSnapshot = () => {
      try {
        const data = readFileSync(`examples/cra-${type}/results.txt`, {
          encoding: 'utf-8',
        });

        // since eslint stores absolute
        return data.replaceAll(
          `C:\\Users\\gerr.it\\Desktop\\dev\\eslint-config-galex\\examples\\cra-${type}\\src`,
          resolve(`examples\\cra-${type}\\src`)
        );
      } catch {
        return null;
      }
    };

    const snapshot = readSnapshot();

    try {
      execSync(
        `cd examples/cra-${type} && node_modules/.bin/eslint src --format=tap > results.txt`,
        {
          env,
        }
      );
    } catch {
      if (snapshot) {
        expect(snapshot).toStrictEqual(readSnapshot());
      }
    }
  });
});

describe('next', () => {
  test.each(['js', 'ts'])('%s', type => {
    const readSnapshot = () => {
      try {
        const data = readFileSync(`examples/next-${type}/results.txt`, {
          encoding: 'utf-8',
        });

        // since eslint stores absolute
        return data.replaceAll(
          `C:\\Users\\gerr.it\\Desktop\\dev\\eslint-config-galex\\examples\\next-${type}`,
          resolve(`examples\\next-${type}`)
        );
      } catch {
        return null;
      }
    };

    const snapshot = readSnapshot();

    try {
      execSync(
        `cd examples/next-${type} && node_modules/.bin/eslint pages --format=tap > results.txt`,
        {
          env,
        }
      );
    } catch {
      if (snapshot) {
        expect(snapshot).toStrictEqual(readSnapshot());
      }
    }
  });
});
