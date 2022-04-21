import { Entity } from "ecsy";
import { Vector3 } from "three";
import Body from "../../components/body";
import FollowCamera from "../../components/followCamera";
import CameraSystem from "./cameraSystem";

export default class FollowCameraSystem extends CameraSystem {
  protected idealOffset: Vector3 = new Vector3();

  protected calculateIdealOffset(entity: Entity): Vector3 {
    const idealOffset = this.idealOffset.clone();
    idealOffset.add(this.getTargetPosition(entity));
    return idealOffset;
  }

  protected calculateIdealLookAt(entity: Entity): Vector3 {
    return this.getTargetPosition(entity);
  }

  protected setupCamera() {
    // TODO: These should be parameters :)
    this.idealOffset = new Vector3(15, 15, 15);
  }
}

FollowCameraSystem.queries = {
  target: {
    components: [FollowCamera, Body],
    listen: {
      added: true,
    }
  },
}