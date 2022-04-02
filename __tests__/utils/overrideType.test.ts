import { dropOverrideType, tsOverrideType } from '../../src/utils/overrideType';

test('removes overrideType', () => {
  const result = dropOverrideType({
    files: [],
    rules: {},
    overrideType: tsOverrideType,
  });

  expect('overrideType' in result).toBe(false);
});
