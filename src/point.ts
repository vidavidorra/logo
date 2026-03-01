class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  /**
   * SVG path element as specified by https://www.w3.org/TR/SVG2/paths.html.
   */
  toSvgPathElement(initialPoint: boolean): string {
    return `${initialPoint ? 'M' : 'L'} ${this.x} ${this.y}`;
  }
}

export {Point};
