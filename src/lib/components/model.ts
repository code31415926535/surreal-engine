import { AnimationClip, Bone, Box3, Mesh, Object3D, Skeleton } from "three";

export default class Model {
  public boundingBox: Box3 | null = null;

  constructor(public mesh: Object3D) {}

  public get attachmentPoints() {
    return this.skeleton ?
      this.skeleton.bones.map(bone => bone.name) :
      [];
  }

  public get clips(): AnimationClip[] {
    return this.mesh.animations;
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

  public computeBoundingBox() {
    this.mesh.traverse(child => {
      if (! this.boundingBox && (child as Mesh).isMesh) {
        (child as Mesh).geometry.computeBoundingBox();
        this.boundingBox = new Box3();
        this.boundingBox.copy((child as Mesh).geometry.boundingBox!);
      }
    })
  }
}
