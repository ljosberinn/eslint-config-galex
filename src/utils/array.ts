export const uniqueArrayEntries = (arr: unknown[]): string[] =>
  [...new Set(arr)].filter(
    (dataset): dataset is string => typeof dataset === 'string'
  );
