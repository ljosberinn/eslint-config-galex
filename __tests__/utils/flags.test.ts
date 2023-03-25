import { type Linter } from 'eslint';

import { applyFlags } from '../../src/utils/flags';

const mockRules: Linter.RulesRecord = {
  foo: 'warn',
  bar: 'error',
  baz: 'off',
  arrWithStr: ['warn', {}],
  arrWithNumber: [1, {}],
};

test('applies all flags when given', () => {
  expect(
    applyFlags(mockRules, {
      blankSlate: true,
      convertToESLintInternals: true,
      incrementalAdoption: true,
    })
  ).toMatchInlineSnapshot(`
    {
      "arrWithNumber": 0,
      "arrWithStr": 0,
      "bar": 0,
      "baz": 0,
      "foo": 0,
    }
  `);
});

test('does nothing without flags', () => {
  expect(applyFlags(mockRules, {})).toMatchObject(mockRules);
});

test('incrementalAdoptionRuleDowngrade works with numbers', () => {
  expect(
    applyFlags(
      {
        foo: 1,
        bar: 2,
        baz: 0,
      },

      {
        incrementalAdoption: true,
      }
    )
  ).toMatchInlineSnapshot(`
    {
      "bar": 1,
      "baz": 0,
      "foo": 0,
    }
  `);
});

test('convertRuleToEslintInternalValue works with numbers', () => {
  expect(
    applyFlags(
      {
        foo: 1,
        bar: 2,
        baz: 0,
      },

      {
        convertToESLintInternals: true,
      }
    )
  ).toMatchInlineSnapshot(`
    {
      "bar": 2,
      "baz": 0,
      "foo": 1,
    }
  `);
});

describe('individual flags', () => {
  test('blankSlate', () => {
    expect(
      applyFlags(mockRules, {
        blankSlate: true,
      })
    ).toMatchInlineSnapshot(`
      {
        "arrWithNumber": "off",
        "arrWithStr": "off",
        "bar": "off",
        "baz": "off",
        "foo": "off",
      }
    `);
  });

  test('convertToESLintInternals', () => {
    expect(
      applyFlags(mockRules, {
        convertToESLintInternals: true,
      })
    ).toMatchInlineSnapshot(`
      {
        "arrWithNumber": [
          1,
          {},
        ],
        "arrWithStr": [
          1,
          {},
        ],
        "bar": 2,
        "baz": 0,
        "foo": 1,
      }
    `);
  });

  test('incrementalAdoption', () => {
    expect(
      applyFlags(mockRules, {
        incrementalAdoption: true,
      })
    ).toMatchInlineSnapshot(`
      {
        "arrWithNumber": 0,
        "arrWithStr": "off",
        "bar": "warn",
        "baz": "off",
        "foo": "off",
      }
    `);
  });
});
