import { satisfies, Options } from 'semver';

const options: Options = {
  includePrerelease: true,
  loose: true,
};

export const fulfillsVersionRequirement = ({
  given,
  expected,
}: {
  expected: string;
  given: string;
}): boolean => {
  return satisfies(expected, given, options);
};
