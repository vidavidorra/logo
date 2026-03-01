import {Buffer} from 'node:buffer';
import sharp from 'sharp';
import {type Svg} from './logo.js';

async function convertSvgToPng(
  svg: Svg,
  shape: 'circle' | 'original' | 'square',
  height: number,
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
): Promise<{data: Buffer; info: sharp.OutputInfo}> {
  const background: sharp.Colour = {r: 0, g: 0, b: 0, alpha: 0};
  const extendOptions: sharp.ExtendOptions = {
    background,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
  const resizeOptions: sharp.ResizeOptions = {background, height};

  if (shape === 'square') {
    resizeOptions.width = resizeOptions.height;
    resizeOptions.fit = 'contain';
  }

  if (shape === 'circle') {
    /**
     * A circle where the logo fits inside in its entirety.
     *
     * The resized logo is defined by a rectangle that fits inside the circle.
     * The circle also fits inside a rectangle, which where each side is the
     * `height` and the diameter of the circle is the `height`. The diagonal of
     * the inner rectangle is the same as the `height`, therfore the sides can
     * be calculated using the Pythagorean theorem.
     */
    const side = Math.ceil(height / Math.sqrt(2));
    resizeOptions.fit = 'contain';
    resizeOptions.width = side;
    resizeOptions.height = side;
    const extension = (height - side) / 2;
    extendOptions.top = Math.ceil(extension);
    extendOptions.bottom = Math.floor(extension);
    extendOptions.left = Math.floor(extension);
    extendOptions.right = Math.ceil(extension);
  }

  return sharp(Buffer.from(svg.document))
    .resize(resizeOptions)
    .extend(extendOptions)
    .png()
    .toBuffer({resolveWithObject: true});
}

export {convertSvgToPng};
