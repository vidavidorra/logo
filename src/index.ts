import {writeFile, mkdir} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {Logo} from './logo.js';
import {convertSvgToPng} from './convert-svg-to-png.js';

const path = resolve('./dist/logo/vidavidorra-logo');
const directory = dirname(path);
await mkdir(directory, {recursive: true});

console.log(`Create vidavidorra logo files in "${directory}"`);
const svg = await new Logo().svg();
await writeFile(`${path}.svg`, svg.document);

const heights = [200, 400, 600, 1080, 2160] as const;
const formats = ['circle', 'original', 'square'] as const;

// eslint-disable-next-line @typescript-eslint/await-thenable
for await (const height of heights) {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  for await (const format of formats) {
    const png = await convertSvgToPng(svg, format, height);
    const suffix = format === 'circle' ? '-circle' : '';
    await writeFile(
      `${path}-${png.info.width}x${png.info.height}${suffix}.png`,
      png.data,
    );
  }
}
