/* eslint-disable jest/no-conditional-expect, import/no-dynamic-require */
// @ts-check

const { execSync } = require('child_process');
const { readFileSync } = require('fs');
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
      results: normalizeSnapshot(
        readFileSync(resolve(cwd, 'results.txt'), {
          encoding: 'utf-8',
        })
      ),
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
 * @param {string} content
 */
const normalizeSnapshot = content => {
  return (
    content // iterate each line in results.txt
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

const cases = [
  { name: 'create-react-app javascript', type: 'cra', lng: 'js' },
  { name: 'create-react-app typescript', type: 'cra', lng: 'ts' },
  { name: 'create-next-app javascript', type: 'next', lng: 'js' },
  { name: 'create-next-app typescript', type: 'next', lng: 'ts' },
];

describe.each(cases)('$case.name', ({ type, name, lng }) => {
  const cwd = resolve('integration', `${type}-${lng}`);
  const { results, config, deps } = readSnapshots(cwd);

  test(`${name}`, () => {
    try {
      execSync('yarn lint:integration', { cwd, env });
    } catch {
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
