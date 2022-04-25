import { Material, MeshPhongMaterial, RepeatWrapping, Texture } from "three";

export interface SurrealMaterialOpts {
  type: 'real';
  color?: string;
  textures?: {
    map: Texture;
    normalMap?: Texture;
    aoMap?: Texture;
    bumpMap?: Texture;
  }
  repeat?: { x: number, y: number };
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
        map: this.cloneTexture(opts.textures.map, opts),
        normalMap: this.cloneTexture(opts.textures.normalMap, opts),
        aoMap: this.cloneTexture(opts.textures.aoMap, opts),
        bumpMap: this.cloneTexture(opts.textures.bumpMap, opts),
        opacity: opts.opacity || 1,
        shininess: opts.shininess || 30,
        reflectivity: opts.reflectivity || 1,
      });
    }
  }

  private cloneTexture(texture: Texture | undefined, opts: SurrealMaterialOpts): Texture | undefined {
    if (!texture) {
      return undefined;
    }
    const clone = texture.clone();
    clone.wrapS = RepeatWrapping;
    clone.wrapT = RepeatWrapping;
    clone.repeat.set(opts.repeat?.x || 1, opts.repeat?.y || 1);
    clone.needsUpdate = true;
    return clone;
  }
}
