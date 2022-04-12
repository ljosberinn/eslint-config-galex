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
  const isPreact = dependencies.has('preact');

  const version = hasReact
    ? /* istanbul ignore next packageJson can't have undefined values */
      dependencies.get('react') ?? null
    : isPreact
    ? /* istanbul ignore next packageJson can't have undefined values */
      dependencies.get('preact') ?? null
    : null;

  return {
    hasReact: hasReact || isPreact,
    isCreateReactApp: hasReact && dependencies.has('react-scripts'),
    isNext: hasReact && dependencies.has('next'),
    isRemix: hasReact && dependencies.has('@remix-run/react'),
    isPreact,
    version,
  };
};

const maybeFindTsConfig = ({ cwd, tsConfigPath }: GetTopLevelTsConfigArgs) => {
  try {
    return getTopLevelTsConfig({ cwd, tsConfigPath });
  } catch (error) {
    /* istanbul ignore next we only throw errors */
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
};

export const detectTypeScript = (
  dependencies: Map<string, string>,
  maybeFindTsConfigArgs: GetTopLevelTsConfigArgs
): Dependencies['typescript'] => {
  const version = dependencies.get('typescript') ?? null;
  const config = version ? maybeFindTsConfig(maybeFindTsConfigArgs) : null;
  const hasTypeScript = !!version && !!config;

  return {
    config,
    hasTypeScript,
    version: hasTypeScript ? version : null,
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
  return {
    hasStorybook: [...dependencies.keys()].some(
      dependency =>
        dependency.startsWith('@storybook/') &&
        dependency !== '@storybook/testing-library'
    ),
    hasStorybookTestingLibrary: dependencies.has('@storybook/testing-library'),
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
    const typescript = detectTypeScript(deps, {
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
        version: null,
      },
      typescript: {
        config: null,
        hasTypeScript: false,
        version: null,
      },
    };
  }
};
