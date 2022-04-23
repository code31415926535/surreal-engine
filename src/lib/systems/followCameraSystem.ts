import { Entity } from "ecsy";
import { Vector3 } from "three";
import Body from "../components/body";
import FollowCamera, { FollowCameraSchema } from "../components/followCamera";
import { getPosition, getQuaternion } from "../entityUtils";
import SurrealSystem from "./surrealSystem";

export default class FollowCameraSystem extends SurrealSystem {
  private currentPosition: Vector3 = new Vector3();
  private currentLookAt: Vector3 = new Vector3();

  private calculateIdealOffset(target: Entity): Vector3 {
    const followCamera = target.getComponent(FollowCamera)! as any as FollowCameraSchema;
    const idealOffset = followCamera.idealOffset.clone();
    if (followCamera.followRotation) {
      idealOffset.applyQuaternion(getQuaternion(target));
    }
    idealOffset.add(getPosition(target));
    return idealOffset;
  }

  private calculateIdealLookAt(target: Entity): Vector3 {
    const followCamera = target.getComponent(FollowCamera)! as any as FollowCameraSchema;
    const idealLookAt = followCamera.idealLookAt.clone();
    if (followCamera.followRotation) {
      idealLookAt.applyQuaternion(getQuaternion(target));
    }
    idealLookAt.add(getPosition(target));
    return idealLookAt;
  }

  private updateCamera(entity: Entity, delta: number) {
    const idealPosition = this.calculateIdealOffset(entity);
    const idealLookAt = this.calculateIdealLookAt(entity);

    const t = 1.0 - Math.pow(0.001, delta);

    this.currentLookAt.lerp(idealLookAt, t);
    this.currentPosition.lerp(idealPosition, t);

    this.renderSystem.camera.position.copy(this.currentPosition);
    this.renderSystem.camera.lookAt(this.currentLookAt);
  }

  execute(delta: number): void {
    for (const target of this.queries.target.results) {
      this.updateCamera(target, delta);
    }
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