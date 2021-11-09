/* eslint-disable jest/no-conditional-expect */
const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const env = {
  env: 'production',
};

const readSnapshots = folder => {
  try {
    return {
      tap: readFileSync(`integration/${folder}/results.txt`, {
        encoding: 'utf-8',
      }),
      config: require(`integration/${folder}/eslint-config.json`),
      deps: require(`integration/${folder}/deps.json`),
    };
  } catch {
    return {
      tap: null,
      config: null,
      deps: null,
    };
  }
};

const normalizeSnapshot = folder => {
  const resultFilePath = resolve(`integration/${folder}/results.txt`);

  writeFileSync(
    resultFilePath,
    readFileSync(resultFilePath, {
      encoding: 'utf-8',
    })
      .split('\n')
      .map(line => {
        if (!line.includes('eslint-config-galex')) {
          return line;
        }

        return line
          .split(' ')
          .map(word => {
            if (!word.includes('eslint-config-galex')) {
              return word;
            }

            return word.slice(word.indexOf('eslint-config-galex') - 1);
          })
          .join(' ');
      })
      .join('\n')
  );
};

describe('integration tests', () => {
  test.each(['cra-js', 'cra-ts', 'next-js', 'next-ts'])('%s', folder => {
    const { tap, config, deps } = readSnapshots(folder);
    const cwd = resolve('integration', folder);

    try {
      execSync('yarn lint:integration --max-warnings=0', {
        env,
        cwd,
      });
    } catch {
      normalizeSnapshot(folder);

      const updatedSnapshots = readSnapshots(folder);

      if (tap) {
        expect(tap).toStrictEqual(updatedSnapshots.tap);
        expect(config).toStrictEqual(updatedSnapshots.config);
        expect(deps).toStrictEqual(updatedSnapshots.deps);
      }
    } finally {
      execSync('prettier --write *.json', { cwd });
    }
  });
});
