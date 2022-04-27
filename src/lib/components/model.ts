import { Bone, Object3D, Skeleton } from "three";

export default class Model {
  constructor(public mesh: Object3D) {}

  public get attachmentPoints() {
    return this.skeleton ?
      this.skeleton.bones.map(bone => bone.name) :
      [];
  }

  public get skeleton(): Skeleton | null {
    let result: Bone[] = [];
    this.mesh.traverse((child) => {
      if ((child as Bone).isBone) {
        result.push((child as Bone));
      }
    });

    return result.length > 0 ? new Skeleton(result) : null;
  }
}
