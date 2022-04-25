import Ammo from "ammojs-typed";
import { Quaternion, Vector3 } from "three";

export default class Body {
  public prevY: number;

  constructor(public body: Ammo.btRigidBody) {
    this.prevY = 0;
  }

  public get position(): Vector3 {
    const worldTransform = this.body.getWorldTransform();
    return new Vector3(
      worldTransform.getOrigin().x(),
      worldTransform.getOrigin().y(),
      worldTransform.getOrigin().z(),
    );
  }

  public get quaternion(): Quaternion {
    const worldTransform = this.body.getWorldTransform();
    return new Quaternion(
      worldTransform.getRotation().x(),
      worldTransform.getRotation().y(),
      worldTransform.getRotation().z(),
      worldTransform.getRotation().w(),
    );
  }
}
