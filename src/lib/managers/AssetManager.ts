import { AnimationClip, Group, LoadingManager, RepeatWrapping, Texture, Wrapping } from "three";
import ModelLoader, { LoadModelOptions } from "../utils/model";
import TextureLoader from "../utils/texture";

export interface AddTextureOptions {
  wrapS?: Wrapping;
  wrapT?: Wrapping;
  repeat?: { x: number, y: number };
}

/**
 * Asset manager class. It is responsible to load assets
 *  and store them in a single place.
 */
export default class AssetManager {
  private loadingManager: LoadingManager;
  private textureLoader: TextureLoader;
  private modelLoader: ModelLoader;

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
  private modelsToLoad: {
    name: string;
    path: string;
    opts?: LoadModelOptions
  }[] = [];
  private animationsToLoad: {
    name: string;
    path: string;
    opts?: LoadModelOptions
  }[] = [];

  private textures: { [name: string]: Texture } = {};
  private models: { [name: string]: Group } = {};
  private animations: { [name: string]: AnimationClip } = {};

  constructor() {
    this.loadingManager = new LoadingManager();
    this.textureLoader = new TextureLoader(this.loadingManager);
    this.modelLoader = new ModelLoader(this.loadingManager);
    this.basePath = "/assets/";
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

  public addModel(name: string, path: string, opts?: LoadModelOptions): void {
    this.modelsToLoad.push({ name, path: this.basePath + path, opts });
  }

  public addAnimation(name: string, path: string, opts?: LoadModelOptions): void {
    this.animationsToLoad.push({ name, path: this.basePath + path, opts });
  }

  public isTexture(name: string): boolean {
    return !!this.textures[name];
  }

  public getTexture(name: string): Texture {
    return this.textures[name];
  }

  public getModel(name: string): Group {
    return this.models[name];
  }

  public getAnimation(name: string): AnimationClip {
    return this.animations[name];
  }

  public async load(
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    if (onProgress) {
      this.loadingManager.onProgress = (_, loaded, total) => {
        onProgress(loaded / total);
      }
    }

    const promisesTexture = this.texturesToLoad.map(async (texture) => {
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
    const promisesModel = this.modelsToLoad.map(async (model) => {
      const result = await this.modelLoader.load(model.path, model.opts);
      this.models[model.name] = result;
    });
    const promisesAnimation = this.animationsToLoad.map(async (animation) => {
      const result = await this.modelLoader.loadAnimation(animation.path, animation.opts);
      this.animations[animation.name] = result;
    });

    await Promise.all([
      ...promisesTexture,
      ...promisesCube,
      ...promisesModel,
      ...promisesAnimation,
    ]);
    this.texturesToLoad = [];
    this.cubeTexturesToLoad = [];
    this.modelsToLoad = [];
  }
}