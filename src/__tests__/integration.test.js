/* eslint-disable jest/no-conditional-expect, import/no-dynamic-require */
// @ts-check

const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const env = {
  env: 'production',
};

/**
 *
 * @param {string} cwd
 * @returns {{
 *  results: string;
 *  config: Record<string, unknown>;
 *  deps: Record<string, unknown>;
 * }}
 */
const readSnapshots = cwd => {
  try {
    return {
      results: readFileSync(resolve(cwd, 'results.txt'), {
        encoding: 'utf-8',
      }),
      config: require(resolve(cwd, 'eslint-config.json')),
      deps: require(resolve(cwd, 'deps.json')),
    };
  } catch {
    return {
      results: null,
      config: null,
      deps: null,
    };
  }
};

const variablePathDelimiter = 'eslint-config-galex';

/**
 *
 * @param {string} cwd
 */
const normalizeSnapshot = cwd => {
  const resultFilePath = resolve(cwd, 'results.txt');

  writeFileSync(
    resultFilePath,
    readFileSync(resultFilePath, {
      encoding: 'utf-8',
    })
      // iterate each line in results.txt
      .split('\n')
      // skip yarn start/end
      .filter(
        line => !line.startsWith('yarn run') && !line.startsWith('info Visit')
      )
      .map(line =>
        // and in each line that includes a path
        line.includes(variablePathDelimiter)
          ? line
              .split(' ')
              .map(word =>
                // remove anything in front of the path to normalize across envs
                word.includes(variablePathDelimiter)
                  ? word.slice(word.indexOf(variablePathDelimiter) - 1)
                  : word
              )
              .join(' ')
          : line
      )
      .join('\n')
      .replaceAll('  ', ' ')
      .replaceAll('\\', '/')
  );
};

const defaultArgs = Object.entries({
  'max-warnings': 0,
  format: 'tap > results.txt',
}).reduce((acc, [key, value]) => {
  const next = `--${key}=${value}`;
  return acc ? [acc, next].join(' ') : next;
}, '');

const foldersToLint = {
  cra: 'src',
  next: 'pages',
};

const cases = [
  { name: 'create-react-app javascript', type: 'cra', lng: 'js' },
  { name: 'create-react-app typescript', type: 'cra', lng: 'ts' },
  { name: 'create-next-app javascript', type: 'next', lng: 'js' },
  { name: 'create-next-app typescript', type: 'next', lng: 'ts' },
];

describe.each(cases)('$case.name', ({ type, name, lng }) => {
  const cmd = `yarn lint:integration ${foldersToLint[type]} ${defaultArgs}`;
  const cwd = resolve('integration', `${type}-${lng}`);
  const { results, config, deps } = readSnapshots(cwd);

  test(`${name}`, () => {
    try {
      execSync(cmd, { cwd, env });
    } catch {
      normalizeSnapshot(cwd);
      const updatedSnapshots = readSnapshots(cwd);

      if (results) {
        expect(results).toStrictEqual(updatedSnapshots.results);
        expect(config).toStrictEqual(updatedSnapshots.config);
        expect(deps).toStrictEqual(updatedSnapshots.deps);
      }
    } finally {
      execSync('prettier --write *.json', { cwd });
    }
  });
});
