import { Vector2 } from "three";
import { sat } from "../../utils/math";
import { Noise } from 'noisejs';

// TODO: Implement normalization (what is that used for?)
export abstract class HeightmapGenerator {
  public abstract get(x: number, y: number): number;
}

export class FlaredCornerHeightmapGenerator extends HeightmapGenerator {
  public get = (x: number, y: number) => {
    if (x === 0 && y === 0) {
      return 1;
    }
    return 0;
  }
}

export class BumpHeightmapGenerator extends HeightmapGenerator {
  constructor(private center: Vector2 = new Vector2(), private extent: number = 25.0) {
    super();
  }

  public get = (x: number, y: number) => {
    const dist = new Vector2(x, y).distanceTo(this.center);
    const h = 1 - sat(dist / this.extent);
    return h * h * h * (h * (h * 6 - 15) + 10);
  }
}

export class PerlinNoiseGenerator extends HeightmapGenerator {
  private noise: Noise;
  constructor(private size: number, seed: number = Math.random()) {
    super();
    this.noise = new Noise(seed);
  }

  public get = (x: number, y: number) => {
    return (this.noise.perlin2(x / this.size, y / this.size) + 1) / 2;
  }
}