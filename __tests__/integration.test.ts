/* eslint-disable jest/no-conditional-expect, import/no-dynamic-require, @typescript-eslint/no-require-imports, jest/no-conditional-in-test */
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

type Snaphot = {
  results: string | null;
  config: string | null;
  deps: string | null;
};

const readSnapshots = (cwd: string): Snaphot => {
  try {
    const config = resolve(cwd, 'eslint-config.json');
    const results = readFileSync(resolve(cwd, 'results.txt'), 'utf-8');
    const deps = resolve(cwd, 'deps.json');

    return {
      results: normalizeSnapshot(results),
      config: require(config),
      deps: require(deps),
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

const normalizeSnapshot = (content: string) => {
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
  { name: 'create-react-app javascript', path: 'cra-js' },
  { name: 'create-react-app typescript', path: 'cra-ts' },
  { name: 'create-next-app javascript', path: 'next-js' },
  { name: 'create-next-app typescript', path: 'next-ts' },
  { name: 'create-remix javascript', path: 'remix-js' },
  { name: 'create-remix typescript', path: 'remix-ts' },
  { name: 'jest', path: 'jest' },
  { name: 'nest typescript', path: 'next-ts' },
];

describe.each(cases)('$case.name', ({ path, name }) => {
  const cwd = resolve('integration', path);
  const { results, config, deps } = readSnapshots(cwd);

  test(`${name}`, () => {
    try {
      execSync('yarn lint:integration', {
        cwd,
        env: {
          NODE_ENV: 'production',
          PUBLIC_URL: '',
        },
      });
    } catch {
      const updatedSnapshots = readSnapshots(cwd);

      if (results) {
        expect(results).toStrictEqual(updatedSnapshots.results);
        expect(config).toStrictEqual(updatedSnapshots.config);
        expect(deps).toStrictEqual(updatedSnapshots.deps);
      }
    }
  });
});
