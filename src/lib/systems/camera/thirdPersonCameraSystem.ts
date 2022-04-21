import { Entity } from "ecsy";
import { Vector3 } from "three";
import Body from "../../components/body";
import ThirdPersonCamera from "../../components/thirdPersonCamera";
import { getPosition, getQuaternion } from "../../entityUtils";
import CameraSystem from "./cameraSystem";

export default class ThirdPersonCameraSystem extends CameraSystem {
  private idealOffset: Vector3 = new Vector3();
  private idealLookAt: Vector3 = new Vector3();

  protected calculateIdealOffset(target: Entity): Vector3 {
    const idealOffset = this.idealOffset.clone();
    idealOffset.applyQuaternion(getQuaternion(target));
    idealOffset.add(getPosition(target));
    return idealOffset;
  }

  protected calculateIdealLookAt(target: Entity): Vector3 {
    const idealLookAt = this.idealLookAt.clone();
    idealLookAt.applyQuaternion(getQuaternion(target));
    idealLookAt.add(getPosition(target));
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