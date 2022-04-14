import { Entity, System } from "ecsy";
import { Vector3 } from "three";
import Body, { BodySchema } from "../components/body";
import FollowCamera from "../components/followCamera";
import RenderSystem from "./renderSystem";

// TODO: Smooth camera movement
export default class FollowCameraSystem extends System {
  private currentPosition!: Vector3;
  private currentLookAt!: Vector3;

  private setupCamera(entity: Entity) {
    const rendererSystem = this.world.getSystem(RenderSystem);
    const body = entity.getComponent(Body)! as any as BodySchema;
    const worldTransform = new window.Ammo.btTransform();

    this.currentPosition = rendererSystem.camera.position.clone();
    this.currentLookAt = new Vector3();
    body.obj.getMotionState().getWorldTransform(worldTransform);
    rendererSystem.camera.position.add(new Vector3(
      worldTransform.getOrigin().x(),
      worldTransform.getOrigin().y(),
      worldTransform.getOrigin().z(),
    ));
    this.currentLookAt = rendererSystem.camera.getWorldDirection(new Vector3());
    rendererSystem.camera.lookAt(this.currentLookAt.clone().add(new Vector3(
      worldTransform.getOrigin().x(),
      worldTransform.getOrigin().y(),
      worldTransform.getOrigin().z(),
    )));
  }

  private updateCamera(entity: Entity) {
    const rendererSystem = this.world.getSystem(RenderSystem);
    const body = entity.getComponent(Body)! as any as BodySchema;
    const worldTransform = body.obj.getWorldTransform();
    const target = new Vector3(
      worldTransform.getOrigin().x(),
      worldTransform.getOrigin().y(),
      worldTransform.getOrigin().z(),
    );
    const delta = target.sub(this.currentLookAt);
    this.currentLookAt.add(delta);
    this.currentPosition.add(delta);
    rendererSystem.camera.position.copy(this.currentPosition);
    rendererSystem.camera.lookAt(this.currentLookAt);
  }

  execute(): void {
    const added = this.queries.followCamera.added!;
    for (const followCamera of added) {
      this.setupCamera(followCamera);
    }

    for (const entity of this.queries.followCamera.results) {
      this.updateCamera(entity);
    }
  }
}

FollowCameraSystem.queries = {
  followCamera: {
    components: [FollowCamera, Body],
    listen: {
      added: true,
    }
  },
}