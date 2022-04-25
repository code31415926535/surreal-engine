import { Material, MeshPhongMaterial, Texture } from "three";

export interface SurrealMaterialOpts {
  type: 'real';
  color?: string;
  textures?: {
    map: Texture;
    normalMap?: Texture;
    aoMap?: Texture;
    bumpMap?: Texture;
  }
  shininess?: number;
  reflectivity?: number;
  opacity?: number;
}

export default class SurrealMaterial {
  public material: Material;

  constructor(opts: SurrealMaterialOpts) {
    if (!opts.textures) {
      this.material = new MeshPhongMaterial({
        color: opts.color || '#ffffff',
        opacity: opts.opacity || 1,
        shininess: opts.shininess || 30,
        reflectivity: opts.reflectivity || 1,
      });
    } else {
      this.material = new MeshPhongMaterial({
        map: opts.textures.map,
        normalMap: opts.textures.normalMap,
        aoMap: opts.textures.aoMap,
        bumpMap: opts.textures.bumpMap,
        opacity: opts.opacity || 1,
        shininess: opts.shininess || 30,
        reflectivity: opts.reflectivity || 1,
      });
    }
  }
}
