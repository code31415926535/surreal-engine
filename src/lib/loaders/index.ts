import { LoadingManager, RepeatWrapping, Texture, Wrapping } from "three";
import TextureLoader from "./texture";

export interface AddTextureOptions {
  wrapS?: Wrapping;
  wrapT?: Wrapping;
  repeat?: { x: number, y: number };
}

/**
 * Asset manager class. It is responsible to load assets
 *  and store them in a single place.
 */
export default class Assets {
  private loadingManager: LoadingManager;
  private textureLoader: TextureLoader;

  private basePath: string;
  private texturesToLoad: {
    name: string;
    path: string;
    opts?: AddTextureOptions;
  }[] = [];
  private cubeTexturesToLoad: {
    name: string;
    paths: string[];
  }[] = [];

  private textures: { [name: string]: Texture } = {};

  constructor() {
    this.loadingManager = new LoadingManager();
    this.textureLoader = new TextureLoader(this.loadingManager);
    this.basePath = "/resources/";
  }

  public setBasePath(path: string): void {
    this.basePath = path;
  }

  public addCubeTexture(name: string, paths: string[]): void {
    this.cubeTexturesToLoad.push({ name, paths: paths.map(path => this.basePath + path) });
  }

  public addTexture(name: string, path: string, opts?: AddTextureOptions): void {
    this.texturesToLoad.push({ name, path: this.basePath + path, opts });
  }

  public getTexture(name: string): Texture {
    return this.textures[name];
  }

  public async load(
    onProgress: (progress: number) => void,
  ): Promise<void> {
    this.loadingManager.onProgress = (_, loaded, total) => {
      onProgress(loaded / total);
    }

    const promises = this.texturesToLoad.map(async (texture) => {
      const result = await this.textureLoader.load(texture.path);
      result.wrapS = texture.opts?.wrapS || RepeatWrapping;
      result.wrapT = texture.opts?.wrapT || RepeatWrapping;
      result.repeat.x = texture.opts?.repeat?.x || 1;
      result.repeat.y = texture.opts?.repeat?.y || 1;
      this.textures[texture.name] = result;
    });
    const promisesCube = this.cubeTexturesToLoad.map(async (texture) => {
      const result = await this.textureLoader.loadCube(texture.paths);
      this.textures[texture.name] = result;
    });

    await Promise.all([...promises, ...promisesCube]);
  }
}