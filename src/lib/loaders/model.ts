import { Group, LoadingManager, Mesh, MeshBasicMaterial } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export interface LoadModelOptions {
  scale: number;
}

export default class ModelLoader {
  constructor(private manager: LoadingManager) {}

  public async load(path: string, opts?: LoadModelOptions): Promise<Group> {
    const extension = path.split(".").pop();
    switch (extension) {
      case "fbx":
        return await this.loadFbx(path, opts);
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
}