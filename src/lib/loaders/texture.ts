import {
  LoadingManager,
  Texture,
  TextureLoader as ThreeTextureLoader,
} from "three";

export default class TextureLoader {
  constructor(private manager: LoadingManager) {}

  public async load(path: string): Promise<Texture> {
    const loader = new ThreeTextureLoader(this.manager);
    return loader.load(path);
  }
}