import { Entity } from "ecsy";
import { Vector3 } from "three";
import Body from "../../components/body";
import ThirdPersonCamera from "../../components/thirdPersonCamera";
import CameraSystem from "./cameraSystem";

export default class ThirdPersonCameraSystem extends CameraSystem {
  private idealOffset: Vector3 = new Vector3();
  private idealLookAt: Vector3 = new Vector3();

  protected calculateIdealOffset(target: Entity): Vector3 {
    const idealOffset = this.idealOffset.clone();
    idealOffset.applyQuaternion(this.getTargetQuaternion(target));
    idealOffset.add(this.getTargetPosition(target));
    return idealOffset;
  }

  protected calculateIdealLookAt(target: Entity): Vector3 {
    const idealLookAt = this.idealLookAt.clone();
    idealLookAt.applyQuaternion(this.getTargetQuaternion(target));
    idealLookAt.add(this.getTargetPosition(target));
    return idealLookAt;
  }

  protected setupCamera() {
    // TODO: These should be parameters :)
    this.idealLookAt = new Vector3(5, 2.5, 0);
    this.idealOffset = new Vector3(-15, 5, 0);
  }
}

ThirdPersonCameraSystem.queries = {
  target: {
    components: [ThirdPersonCamera, Body],
    listen: {
      added: true,
    }
  },
}