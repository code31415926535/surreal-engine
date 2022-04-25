import { Entity, EntitySnapshot, IterativeSystem, Query } from 'tick-knock';
import { Vector3 } from "three";
import Body from "../components/body";
import Model from "../components/model";
import StaticMotion from "../components/staticMotion";

// TODO: Refactor system to work on body instead of model
export default class StaticMotionSystem extends IterativeSystem {
  constructor() {
    super(new Query(entity => entity.hasAll(Model, StaticMotion) && !entity.has(Body)));
  }

  protected entityAdded = ({current}: EntitySnapshot) => {
    const model = current.get(Model)!;
    const staticMotion = current.get(StaticMotion)!;
    staticMotion.pos = model.mesh.position.clone();
  }

  protected updateEntity(entity: Entity, delta: number): void {
    const staticMotion = entity.get(StaticMotion)!;
    const model = entity.get(Model)!;

    staticMotion.current += delta;
    if (staticMotion.current > staticMotion.duration) {
      if (staticMotion.loop) {
        staticMotion.current = 0;
      }
      else {
        entity.removeComponent(StaticMotion);
        return;
      }
    }

    this.updateModel(model, staticMotion);
  }

  private updateModel(model: Model, staticMotion: StaticMotion): void {
    const fraction = staticMotion.current / staticMotion.duration;
    const position = staticMotion.path.getPointAt(fraction);
    const tangent = staticMotion.path.getTangentAt(fraction);

    const up = new Vector3(0, 1, 0);
    const axis = new Vector3();
    model.mesh.position.copy(staticMotion.pos.clone().add(position));
    axis.crossVectors(up, tangent).normalize();
    model.mesh.quaternion.setFromAxisAngle(axis, Math.acos(up.dot(tangent)));
  }
}
