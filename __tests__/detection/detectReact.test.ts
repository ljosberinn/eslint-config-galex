import { detectReact } from '../../src/getDependencies';

describe('detectReact', () => {
  const baseReact: [string, string] = ['react', '1.0.0'];

  test('with react', () => {
    const map = new Map<string, string>([baseReact]);

    expect(detectReact(map)).toMatchInlineSnapshot(`
      {
        "hasReact": true,
        "isCreateReactApp": false,
        "isNext": false,
        "isPreact": false,
        "isRemix": false,
        "version": "1.0.0",
      }
    `);
  });

  test('with create-react-app', () => {
    const map = new Map<string, string>([
      baseReact,
      ['react-scripts', '1.0.0'],
    ]);

    expect(detectReact(map)).toMatchInlineSnapshot(`
      {
        "hasReact": true,
        "isCreateReactApp": true,
        "isNext": false,
        "isPreact": false,
        "isRemix": false,
        "version": "1.0.0",
      }
    `);
  });

  test('with next', () => {
    const map = new Map<string, string>([baseReact, ['next', '1.0.0']]);

    expect(detectReact(map)).toMatchInlineSnapshot(`
      {
        "hasReact": true,
        "isCreateReactApp": false,
        "isNext": true,
        "isPreact": false,
        "isRemix": false,
        "version": "1.0.0",
      }
    `);
  });

  test('with remix', () => {
    const map = new Map<string, string>([
      baseReact,
      ['@remix-run/react', '1.0.0'],
    ]);

    expect(detectReact(map)).toMatchInlineSnapshot(`
      {
        "hasReact": true,
        "isCreateReactApp": false,
        "isNext": false,
        "isPreact": false,
        "isRemix": true,
        "version": "1.0.0",
      }
    `);
  });

  test('with preact', () => {
    const map = new Map<string, string>([['preact', '1.0.0']]);

    expect(detectReact(map)).toMatchInlineSnapshot(`
      {
        "hasReact": true,
        "isCreateReactApp": false,
        "isNext": false,
        "isPreact": true,
        "isRemix": false,
        "version": "1.0.0",
      }
    `);
  });
});
