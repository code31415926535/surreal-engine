import { Entity, System } from "ecsy";
import { Vector3 } from "three";
import RenderSystem from "../renderSystem";

export default abstract class CameraSystem extends System {
  protected currentPosition: Vector3 = new Vector3();
  protected currentLookAt: Vector3 = new Vector3();

  protected abstract calculateIdealOffset(entity: Entity): Vector3;
  protected abstract calculateIdealLookAt(entity: Entity): Vector3;

  protected setupCamera(_: Entity) {}

  protected updateCamera(entity: Entity, delta: number) {
    const rendererSystem = this.world.getSystem(RenderSystem);

    const idealPosition = this.calculateIdealOffset(entity);
    const idealLookAt = this.calculateIdealLookAt(entity);

    const t = 1.0 - Math.pow(0.001, delta);

    this.currentLookAt.lerp(idealLookAt, t);
    this.currentPosition.lerp(idealPosition, t);

    rendererSystem.camera.position.copy(this.currentPosition);
    rendererSystem.camera.lookAt(this.currentLookAt);
  }

  execute(delta: number): void {
    const added = this.queries.target.added!;
    for (const target of added) {
      this.setupCamera(target);
    }

    for (const target of this.queries.target.results) {
      this.updateCamera(target, delta);
    }
  }
}