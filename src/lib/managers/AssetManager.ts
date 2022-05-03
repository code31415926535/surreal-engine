import { AnimationClip, AnimationUtils, LoadingManager, Object3D, Texture } from "three";
import ModelLoader from "../utils/model";
import TextureLoader from "../utils/texture";

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
  }[] = [];
  private cubeTexturesToLoad: {
    name: string;
    paths: string[];
  }[] = [];
  private modelsToLoad: {
    name: string;
    path: string;
  }[] = [];

  private textures: { [name: string]: Texture } = {};
  private models: { [name: string]: Object3D } = {};
  private animations: { [name: string]: AnimationClip } = {};

  constructor(
    private onProgress: (progress: number) => void,
    private onError: (error: Error) => void,
  ) {
    this.loadingManager = new LoadingManager();
    this.textureLoader = new TextureLoader(this.loadingManager);
    this.modelLoader = new ModelLoader(this.loadingManager);
    this.basePath = "/assets/";
  }

  public list(): string[] {
    return [
      "==Textures==",
      ...Object.keys(this.textures),
      "==Models==",
      ...Object.keys(this.models),
      "==Animations==",
      ...Object.keys(this.animations),
    ];
  }

  public animationsFor(modelName: string): string[] {
    return Object.keys(this.animations).filter(key => key.startsWith(modelName));
  }

  public setBasePath(path: string): void {
    this.basePath = path;
  }

  public addCubeTexture(name: string, paths: string[]): void {
    this.cubeTexturesToLoad.push({ name, paths: paths.map(path => this.basePath + path) });
  }

  public addTexture(name: string, path: string): void {
    this.texturesToLoad.push({ name, path: this.basePath + path });
  }

  public addModel(name: string, path: string): void {
    this.modelsToLoad.push({ name, path: this.basePath + path });
  }

  public isTexture(name: string): boolean {
    return !!this.textures[name];
  }

  public getTexture(name: string): Texture {
    return this.textures[name];
  }

  public getModel(name: string): Object3D {
    return this.models[name];
  }

  public clipAnimation(animationName: string, clipName: string, start: number, end: number) {
    const anim = this.getAnimation(animationName);
    if (!anim) {
      throw new Error(`Animation ${animationName} does not exist`);
    }
    this.animations[clipName] = AnimationUtils.subclip(anim, clipName, start, end);
  }

  public getAnimation(name: string): AnimationClip | undefined {
    return this.animations[name];
  }

  /**
   * Loads all assets and returns a promise that resolves when all assets are loaded.
   * This should always be called after all assets are added.
   * 
   * @returns {Promise<void>}
   */
  public async load(): Promise<void> {
    this.loadingManager.onStart = () => this.onProgress(0);
    this.loadingManager.onProgress = (_, loaded, total) => {
      this.onProgress(loaded / total);
    }
    this.loadingManager.onError = (url: string) => {
      this.onError(new Error(`Failed to load ${url}`));
    };

    const promisesTexture = this.texturesToLoad.map(async (texture) => {
      const result = await this.textureLoader.load(texture.path);
      this.textures[texture.name] = result;
    });
    const promisesCube = this.cubeTexturesToLoad.map(async (texture) => {
      const result = await this.textureLoader.loadCube(texture.paths);
      this.textures[texture.name] = result;
    });
    const promisesModel = this.modelsToLoad.map(async (model) => {
      const result = await this.modelLoader.load(model.path);
      this.models[model.name] = result.object;
      Object.keys(result.animations).forEach(key => {
        this.animations[`${model.name}@${key}`] = result.animations[key];
      });
    });

    await Promise.all([
      ...promisesTexture,
      ...promisesCube,
      ...promisesModel,
    ]);
    this.texturesToLoad = [];
    this.cubeTexturesToLoad = [];
    this.modelsToLoad = [];
  }
}