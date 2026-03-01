import {type Point} from './point.js';

class Path {
  constructor(private readonly points: Point[]) {}

  /**
   * SVG path as specified by https://www.w3.org/TR/SVG2/paths.html.
   */
  toSvgPath(options: {description: string; fill: string}): string {
    const segments = [
      ...this.points.map((point, i) => point.toSvgPathElement(i === 0)),
      'Z',
    ];

    /**
     * Data indentation. The data element, `d` is inside two outer levels, the
     * `svg` and the `path`. With a two space indentation level, this adds up
     * to four spaces. The `d="` of the property name makes up the other three
     * spaces, making the total of 7 spaces. Only the data is indented here as
     * formatting tools usually don't touch the whitespace in values.
     */
    const dataIndentation = ' '.repeat(7);

    return [
      '<path',
      `desc="${options.description}"`,
      `fill="${options.fill}"`,
      'stroke="none"',
      `d="${segments.join(`\n${dataIndentation}`)}"`,
      '/>',
    ].join('\n');
  }

  get width(): number {
    return Math.max(...this.points.map(({x}) => x));
  }

  get height(): number {
    return Math.max(...this.points.map(({y}) => y));
  }
}

export {Path};
