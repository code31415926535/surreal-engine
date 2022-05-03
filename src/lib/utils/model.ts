import { AnimationClip, LoadingManager, Mesh, MeshBasicMaterial, Object3D } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

interface ModelData {
  object: Object3D;
  animations: { [key: string]: AnimationClip };
}

export default class ModelLoader {
  constructor(private manager: LoadingManager) {}

  public async load(path: string): Promise<ModelData> {
    const extension = path.split(".").pop();
    switch (extension) {
      case "fbx":
        const fbx = await this.loadFbx(path);
        return {
          object: fbx,
          animations: {},
        }
      case "gltf":
      case "glb":
        return await this.loadGltf(path);
      case "dae":
        const obj = await this.loadCollada(path);
        return {
          object: obj,
          animations: {},
        }
      default:
        throw new Error(`Unsupported file type '${extension}'`);
    }
  }

  private async loadFbx(path: string): Promise<Object3D> {
    console.warn("FBX may not work properly. Use glTF or collada instead.");
    const loader = new FBXLoader(this.manager);
    const fbx = await loader.loadAsync(path);
    fbx.traverse((child) => {
      if ((child as Mesh).isMesh) {
          child.castShadow = true;
          if ((child as Mesh).material) {
              ((child as Mesh).material as MeshBasicMaterial).transparent = false
          }
      }
    });
    return fbx;
  }

  private async loadCollada(path: string): Promise<Object3D> {
    console.warn("Collada models don't yet support animations.");
    const loader = new ColladaLoader(this.manager);
    const dae = await loader.loadAsync(path);
    return dae.scene;
  }

  private async loadGltf(path: string): Promise<ModelData> {
    const loader = new GLTFLoader(this.manager);
    const glb = await loader.loadAsync(path);
    const animations: { [key: string]: AnimationClip } = {};
    if (glb.animations.length !== 0) {
      glb.animations.forEach(clip => {
        animations[clip.name] = clip;
      })
    }
    return {
      object: glb.scene,
      animations,
    }
  }
}
