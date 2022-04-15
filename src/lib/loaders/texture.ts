import {
  CubeTextureLoader,
  LoadingManager,
  Texture,
  TextureLoader as ThreeTextureLoader,
} from "three";

export default class TextureLoader {
  constructor(private manager: LoadingManager) {}

  public async load(path: string): Promise<Texture> {
    const loader = new ThreeTextureLoader(this.manager);
    return await loader.loadAsync(path);
  }

  public async loadCube(paths: string[]): Promise<Texture> {
    if (paths.length !== 6) {
      throw new Error("Cube map must have 6 sides");
    }
    const loader = new CubeTextureLoader(this.manager);
    return loader.loadAsync(paths as any);
  }
}