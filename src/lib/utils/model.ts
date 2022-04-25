import { AnimationClip, Group, LoadingManager, Mesh, MeshBasicMaterial } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export interface LoadModelOptions {
  scale: number;
}

export default class ModelLoader {
  constructor(private manager: LoadingManager) {}

  public async loadAnimation(path: string, opts?: LoadModelOptions): Promise<AnimationClip> {
    const extension = path.split(".").pop();
    switch (extension) {
      case "fbx":
        const group = await this.loadFbx(path, opts);
        return group.animations[0];
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  }

  public async load(path: string, opts?: LoadModelOptions): Promise<Group> {
    const extension = path.split(".").pop();
    switch (extension) {
      case "fbx":
        return await this.loadFbx(path, opts);
      case "gltf":
      case "glb":
        return await this.loadGltf(path, opts);
      default:
        throw new Error("Unsupported file type");
    }
  }

  private async loadFbx(path: string, opts?: LoadModelOptions): Promise<Group> {
    const scale = opts?.scale || 1;
    const loader = new FBXLoader(this.manager);
    const fbx = await loader.loadAsync(path);
    fbx.scale.set(scale, scale, scale);
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

  private async loadGltf(path: string, opts?: LoadModelOptions): Promise<Group> {
    const scale = opts?.scale || 1;
    const loader = new GLTFLoader(this.manager);
    const glb = await loader.loadAsync(path);
    glb.scene.scale.set(scale, scale, scale);
    return glb.scene;
  }
}