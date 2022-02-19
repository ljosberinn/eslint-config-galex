const cache = new Map<string, number[]>();

const toNumbers = (str: string) => {
  const maybeCached = cache.get(str);

  if (maybeCached) {
    return maybeCached;
  }

  const result = str
    .split('.')
    .map(str =>
      [...str]
        .map(char => Number.parseInt(char))
        .filter(maybeNumber => !Number.isNaN(maybeNumber))
        .join('')
    )
    .map(char => Number.parseInt(char));

  cache.set(str, result);

  return result;
};

export const fulfillsVersionRequirement = ({
  given,
  expected,
}: {
  expected: string;
  given: string;
}): boolean => {
  try {
    const [givenMajor, givenMinor, givenPatch] = toNumbers(given);
    const [expectedMajor, expectedMinor, expectedPatch] = toNumbers(expected);

    return (
      givenMajor > expectedMajor ||
      givenMinor > expectedMinor ||
      givenPatch > expectedPatch
    );
  } catch {
    return false;
  }
};
