import { AnimationClip, LoadingManager, Mesh, MeshBasicMaterial, Object3D } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

export default class ModelLoader {
  constructor(private manager: LoadingManager) {}

  // TODO: Return all animations both here and when loading model
  public async loadAnimation(path: string): Promise<AnimationClip> {
    const extension = path.split(".").pop();
    switch (extension) {
      case "fbx":
        const group = await this.loadFbx(path);
        return group.animations[0];
      case "dae":
        const dae = await this.loadCollada(path);
        return dae.animations[0];
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  }

  public async load(path: string): Promise<Object3D> {
    const extension = path.split(".").pop();
    switch (extension) {
      case "fbx":
        return await this.loadFbx(path);
      case "gltf":
      case "glb":
        return await this.loadGltf(path);
      case "dae":
        return await this.loadCollada(path);
      default:
        throw new Error("Unsupported file type");
    }
  }

  private async loadFbx(path: string): Promise<Object3D> {
    console.warn("FBX files can cause unexpected behavior. Use glTF or collada files instead.");
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
    const loader = new ColladaLoader(this.manager);
    const dae = await loader.loadAsync(path);
    return dae.scene;
  }

  private async loadGltf(path: string): Promise<Object3D> {
    const loader = new GLTFLoader(this.manager);
    const glb = await loader.loadAsync(path);
    return glb.scene;
  }
}
