import SurrealMaterial from "../core/surrealMaterial";
import AssetManager from "./AssetManager";
import colorNames from './css-color-names';

interface CommonMaterialOptions {
  opacity?: number;
  shininess?: number;
  reflectivity?: number;
}

export interface PlainMaterialOptions extends CommonMaterialOptions {
  color: string;
}

export interface TexturedMaterialOptions extends CommonMaterialOptions {
  texture: string | {
    map: string;
    normalMap?: string;
    aoMap?: string;
    bumpMap?: string;
  }
}

export default class MaterialManager {
  private materials: Map<string, SurrealMaterial> = new Map();

  constructor(private assets: AssetManager) {
    Object.keys(colorNames).forEach((color) => {
      // @ts-ignore
      this.addPlainMaterial(color, { color: colorNames[color] });
    });
  }

  public getMaterial(name: string): SurrealMaterial {
    if (!this.materials.has(name)) {
      throw new Error(`Material ${name} not found`);
    }
    return this.materials.get(name)!;
  }

  public addPlainMaterial(name: string, opts: PlainMaterialOptions): SurrealMaterial {
    this.materials.set(name, new SurrealMaterial({ ...opts, type: 'real' }));
    return this.getMaterial(name);
  }

  public addTexturedMaterial(name: string, opts: TexturedMaterialOptions): SurrealMaterial {
    if (typeof opts.texture === 'string') {
      if (!this.assets.isTexture(opts.texture)) {
        throw new Error(`Texture ${opts.texture} not found`);
      }

      const textures = {
        map: this.assets.getTexture(opts.texture),
        normalMap: this.assets.getTexture(`${opts.texture}@normal`),
        aoMap: this.assets.getTexture(`${opts.texture}@ao`),
        bumpMap: this.assets.getTexture(`${opts.texture}@bump`),
      };

      this.materials.set(name, new SurrealMaterial({ ...opts, textures, type: 'real' }));
    } else {
      const textures = {
        map: this.assets.getTexture(opts.texture.map),
        normalMap: opts.texture.normalMap ? this.assets.getTexture(opts.texture.normalMap) : undefined,
        aoMap: opts.texture.aoMap ? this.assets.getTexture(opts.texture.aoMap) : undefined,
        bumpMap: opts.texture.bumpMap ? this.assets.getTexture(opts.texture.bumpMap) : undefined,
      };

      this.materials.set(name, new SurrealMaterial({ ...opts, textures, type: 'real' }));
    }
    return this.getMaterial(name);
  }

  public removeMaterial(name: string): void {
    this.materials.delete(name);
  }
}
