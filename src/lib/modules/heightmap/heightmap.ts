import { PlaneGeometry } from "three";
import { HeightmapGenerator } from "./generators";

class Heightmap {
  constructor(
    private width: number,
    private height: number,
    private max: number,
    private generator: HeightmapGenerator,
  ) {}

  applyTo(geometry: PlaneGeometry) {
    const vertices = geometry.attributes.position.array;
    for ( let i = 0, j = 0, l = this.width * this.height; i < l; i ++, j += 3 ) {
      // @ts-ignore
      vertices[j+2] = this.max * this.generator.get(Math.floor(i / (this.width + 1)), i % (this.height + 1));
    }
  }
}

export default Heightmap;