import { Query, Entity } from 'tick-knock';
import { Vector3 } from "three";
import Body from "../components/body";
import FollowCamera from "../components/followCamera";
import RenderSystem from './renderSystem';
import SingleEntitySystem from './singleEntitySystem';

export default class FollowCameraSystem extends SingleEntitySystem {
  private currentPosition: Vector3 = new Vector3();
  private currentLookAt: Vector3 = new Vector3();

  constructor() {
    super(new Query(entity => entity.hasAll(FollowCamera, Body)));
  }

  private calculateIdealOffset(target: Entity): Vector3 {
    const followCamera = target.get(FollowCamera)!;
    const idealOffset = followCamera.idealOffset.clone();
    if (followCamera.followRotation) {
      idealOffset.applyQuaternion(target.get(Body)!.quaternion);
    }
    idealOffset.add(target.get(Body)!.position);
    return idealOffset;
  }

  private calculateIdealLookAt(target: Entity): Vector3 {
    const followCamera = target.get(FollowCamera)!;
    const idealLookAt = followCamera.idealLookAt.clone();
    if (followCamera.followRotation) {
      idealLookAt.applyQuaternion(target.get(Body)!.quaternion);
    }
    idealLookAt.add(target.get(Body)!.position);
    return idealLookAt;
  }

  protected updateEntity(entity: Entity, delta: number): void {
    const idealPosition = this.calculateIdealOffset(entity);
    const idealLookAt = this.calculateIdealLookAt(entity);

    const t = 1.0 - Math.pow(0.001, delta);

    this.currentLookAt.lerp(idealLookAt, t);
    this.currentPosition.lerp(idealPosition, t);

    const renderSystem = this.engine.getSystem(RenderSystem)!;
    renderSystem.camera.position.copy(this.currentPosition);
    renderSystem.camera.lookAt(this.currentLookAt);
  }
}