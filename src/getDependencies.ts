import { sync } from 'read-pkg-up';

import type { GetTopLevelTsConfigArgs } from './getToplevelTsConfig';
import { getTopLevelTsConfig } from './getToplevelTsConfig';
import type { Dependencies } from './types';
import { testingLibFamily } from './utils/defaultsAndDetection';

export type GetDepsArgs = {
  cwd?: string;
  tsConfigPath?: string;
};

export const detectReact = (
  dependencies: Map<string, string>
): Dependencies['react'] => {
  const hasReact = dependencies.has('react');

  return {
    hasReact,
    isCreateReactApp: hasReact && dependencies.has('react-scripts'),
    isNext: hasReact && dependencies.has('next'),
    isRemix: hasReact && dependencies.has('@remix-run/react'),
    // no effect yet
    isPreact: dependencies.has('preact'),
    // might have to be adjusted for preact in the future
    version: dependencies.get('react'),
  };
};

export const detectTypescript = (
  dependencies: Map<string, string>,
  { cwd, tsConfigPath }: GetTopLevelTsConfigArgs
): Dependencies['typescript'] => {
  const hasTypeScriptDependency = dependencies.has('typescript');

  const tsConfig = (() => {
    if (!hasTypeScriptDependency) {
      return null;
    }

    try {
      return getTopLevelTsConfig({ cwd, tsConfigPath });
    } catch (error) {
      if (error instanceof Error) {
        /* istanbul ignore next warning aint that relevant */
        const info = tsConfigPath
          ? `TypeScript found in \`package.json\`, but no config was found or is readable at "${tsConfigPath}":`
          : 'TypeScript found in `package.json` but no `tsconfig.json` was found:';
        // eslint-disable-next-line no-console
        console.info(info, error.message);
      }

      return null;
    }
  })();

  return {
    config: tsConfig,
    hasTypeScript: hasTypeScriptDependency && !!tsConfig,
    version: dependencies.get('typescript'),
  };
};

export const detectJest = (
  dependencies: Map<string, string>
): Dependencies['hasJest'] => {
  return dependencies.has('react-scripts') ? true : dependencies.has('jest');
};

export const detectJestDom = (
  dependencies: Map<string, string>
): Dependencies['hasJestDom'] => {
  return dependencies.has('@testing-library/jest-dom');
};

export const detectNodeTypes = (
  dependencies: Map<string, string>
): Dependencies['hasNodeTypes'] => {
  return dependencies.has('@types/node');
};

export const detectTestingLibrary = (
  dependencies: Map<string, string>
): Dependencies['hasTestingLibrary'] => {
  return testingLibFamily.some(pkg =>
    dependencies.has(`@testing-library/${pkg}`)
  );
};

export const detectStorybook = (
  dependencies: Map<string, string>
): Dependencies['storybook'] => {
  const hasStorybook = [...dependencies.keys()].some(
    dependency =>
      dependency.startsWith('@storybook/') &&
      dependency !== '@storybook/testing-library'
  );
  const hasStorybookTestingLibrary = dependencies.has(
    '@storybook/testing-library'
  );

  return {
    hasStorybook,
    hasStorybookTestingLibrary,
  };
};

export const detectNest = (
  dependencies: Map<string, string>
): Dependencies['hasNest'] => {
  return dependencies.has('@nestjs/core');
};

export const getDependencies = ({
  cwd = process.cwd(),
  tsConfigPath,
}: GetDepsArgs = {}): Dependencies => {
  try {
    const result = sync({ cwd, normalize: true });

    if (!result) {
      throw new Error('unable to read package.json');
    }

    const deps = new Map(
      Object.entries({
        ...result.packageJson.dependencies,
        ...result.packageJson.peerDependencies,
        ...result.packageJson.devDependencies,
      })
    );

    const react = detectReact(deps);
    const typescript = detectTypescript(deps, {
      cwd,
      tsConfigPath,
    });
    const hasJest = detectJest(deps);
    const hasJestDom = detectJestDom(deps);
    const hasNodeTypes = detectNodeTypes(deps);
    const hasTestingLibrary = detectTestingLibrary(deps);
    const storybook = detectStorybook(deps);
    const hasNest = detectNest(deps);

    return {
      hasJest,
      hasJestDom,
      hasNodeTypes,
      hasTestingLibrary,
      hasNest,
      storybook,
      react,
      typescript,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error parsing `package.json`!', error);

    return {
      hasJest: false,
      hasJestDom: false,
      hasNodeTypes: false,
      hasTestingLibrary: false,
      hasNest: false,
      storybook: {
        hasStorybook: false,
        hasStorybookTestingLibrary: false,
      },
      react: {
        hasReact: false,
        isCreateReactApp: false,
        isNext: false,
        isRemix: false,
        isPreact: false,
        version: undefined,
      },
      typescript: {
        config: null,
        hasTypeScript: false,
        version: undefined,
      },
    };
  }
};
