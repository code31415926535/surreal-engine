import { PlaneGeometry } from "three";
import { HeightmapGenerator } from "./generators";

class Heightmap {
  constructor(
    private width: number,
    private height: number,
    private max: number,
    private generator: HeightmapGenerator,
  ) {}

  applyToGeometry(geometry: PlaneGeometry) {
    const vertices = geometry.attributes.position.array;
    for ( let i = 0, j = 0, l = (this.width + 1) * (this.height + 1); i < l; i ++, j += 3 ) {
      // @ts-ignore
      vertices[j+2] = this.getHeightData(i);
    }
  }

  // TODO: Rename
  createRigidShape(shapeWidth: number, shapeHeight: number) {
    // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
    const heightScale = this.max;

    // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
    const upAxis = 1;

    // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
    const hdt = 'PHY_FLOAT';

    // Set this to your needs (inverts the triangles)
    const flipQuadEdges = false;

    // Creates height data buffer in Ammo heap
    const ammoHeightData = window.Ammo._malloc(4 * this.width * this.height);

    // Copy the javascript height data array to the Ammo one.
    let p = 0;
    let p2 = 0;

    // TODO: Single for loop
    for (let j = 0; j < this.height + 1; j ++) {
      for (let i = 0; i < this.width + 1; i ++) {
        // write 32-bit float data to memory
        window.Ammo.HEAPF32[ ammoHeightData + p2 >> 2 ] = this.getHeightData(p);
        p ++;
        // 4 bytes/float
        p2 += 4;
      }
    }
  
    // Creates the heightfield physics shape
    const heightFieldShape = new window.Ammo.btHeightfieldTerrainShape(
      this.width,
      this.height,
      ammoHeightData,
      heightScale,
      0,
      this.max,
      upAxis,
      hdt,
      flipQuadEdges,
    );
  
    // Set horizontal scale
    const scaleX = shapeWidth / this.width;
    const scaleZ = shapeHeight / this.height;
    heightFieldShape.setLocalScaling(new window.Ammo.btVector3( scaleX, 1, scaleZ ));

    heightFieldShape.setMargin(0.05);

    return heightFieldShape;
  }

  private getHeightData(i: number): number {
    return this.max * this.generator.get(Math.floor(i / (this.width + 1)), i % (this.height + 1));
  }
}

export default Heightmap;