import prettier from 'prettier';
import prettierPluginXml from '@prettier/plugin-xml';
import {Path} from './path.js';
import {Point} from './point.js';

type Svg = {document: string; width: number; height: number};

/**
 * Logo as documented in `docs/logo.md`.
 */
class Logo {
  private readonly _colour: string;
  private readonly _height: number;
  private readonly _angle: number;
  private readonly _thickness: number;
  private readonly _horizontalDisplacement: number;
  private readonly _horizontalSlice: number;
  private readonly _verticalSlice: number;
  private readonly _vCenter: number;
  private readonly _vWidth: number;

  constructor() {
    this._colour = '#f78a1e';
    this._height = 100;
    this._angle = 26.5;
    this._thickness = 3;
    this._horizontalDisplacement = Math.tan(this.angle) * this._thickness;
    this._horizontalSlice = this._thickness / Math.cos(this.angle);
    this._verticalSlice = this._thickness / Math.sin(this.angle);
    this._vCenter = Math.tan(this.angle) * this._height;
    this._vWidth = this._vCenter * 2;
  }

  /**
   * SVG document as specified by https://www.w3.org/TR/SVG2/struct.html.
   */
  async svg(): Promise<Svg> {
    const outerPath = this.outerPath();
    const {width, height} = outerPath;

    return {
      document: await this.format(
        [
          '<?xml version="1.0" standalone="no" ?>',
          `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`,
          '<desc>vidavidorra logo</desc>',
          outerPath.toSvgPath({
            description: 'single (outer) V',
            fill: this._colour,
          }),
          this.innerPath().toSvgPath({
            description: 'single (inner) V',
            fill: this._colour,
          }),
          '</svg>',
        ].join('\n'),
      ),
      width,
      height,
    };
  }

  /**
   * Path of the outer, double, `V`. The points start at the top left point and
   * go clockwise around the perimiter of the double `V`.
   */
  private outerPath(): Path {
    return new Path([
      new Point(0, 0),
      new Point(this._vCenter, this._height),
      new Point(this._vWidth - this._horizontalDisplacement, this._thickness),
      new Point(
        this._vWidth - this._horizontalDisplacement + this._horizontalSlice,
        this._thickness,
      ),
      new Point(this._vCenter + this._horizontalSlice, this._height),
      new Point(this._vCenter + 2 * this._horizontalSlice, this._height),
      new Point(this._vWidth + 2 * this._horizontalSlice, 0), // Top right.
      new Point(this._vWidth - this._horizontalSlice, 0),
      new Point(this._vCenter, this._height - this._verticalSlice),
      new Point(
        this._horizontalDisplacement + this._horizontalSlice,
        this._thickness,
      ),
      new Point(
        this._horizontalDisplacement + 4 * this._horizontalSlice,
        this._thickness,
      ),
      new Point(this._vCenter, this._height - 4 * this._verticalSlice),
      new Point(
        this._vCenter + Math.tan(this.angle) * 0.5 * this._verticalSlice,
        this._height - 4.5 * this._verticalSlice,
      ),
      new Point(5 * this._horizontalSlice, 0),
    ]);
  }

  /**
   * Path of the inner `V`. The points start at the top left point and go
   * clockwise around the perimiter of the `V`.
   */
  private innerPath(): Path {
    return new Path([
      new Point(
        2 * this._horizontalDisplacement + 2 * this._horizontalSlice,
        2 * this._thickness,
      ),
      new Point(this._vCenter, this._height - 2 * this._verticalSlice),
      new Point(this._vWidth - 2 * this._horizontalSlice, 0), // Top right.
      new Point(this._vWidth - 3 * this._horizontalSlice, 0),
      new Point(this._vCenter, this._height - 3 * this._verticalSlice),
      new Point(
        2 * this._horizontalDisplacement + 3 * this._horizontalSlice,
        2 * this._thickness,
      ),
    ]);
  }

  /**
   * Angle in radians.
   */
  private get angle(): number {
    return this._angle * (Math.PI / 180);
  }

  private async format(data: string): Promise<string> {
    return prettier.format(data, {
      plugins: [prettierPluginXml],
      tabWidth: 2,
      xmlWhitespaceSensitivity: 'ignore',
      filepath: 'logo.svg',
    });
  }
}

export {Logo, type Svg};
