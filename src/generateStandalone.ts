import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { format } from 'prettier';

import { createConfig } from './createConfig';

const log = (message: string) => {
  // eslint-disable-next-line no-console
  console.log(`[eslint-config-galex] ${message}`);
};

const maybeFindSettings = () => {
  try {
    const path = resolve('./eslint-galex-settings.json');
    const result = readFileSync(path, 'utf-8');
    return JSON.parse(result);
    // eslint-disable-next-line no-empty
  } catch {}
};

try {
  const targetPath = resolve('./eslintrc--generated.json');
  const settings = maybeFindSettings();
  const config = createConfig(settings);

  writeFileSync(
    targetPath,
    format(JSON.stringify(config), {
      parser: 'json-stringify',
    })
  );

  log(`wrote ".eslintrc--generated.json" to "${targetPath}"`);
} catch (error) {
  if (error instanceof Error) {
    log(`error -- ${error.message}`);
  }
}
