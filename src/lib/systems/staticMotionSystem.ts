import { Entity, Not, System } from "ecsy";
import { Vector3 } from "three";
import Body from "../components/body";
import Model, { ModelSchema } from "../components/model";
import StaticMotion, { StaticMotionSchema } from "../components/staticMotion";

export default class StaticMotionSystem extends System {
  private updateModel(model: ModelSchema, staticMotion: StaticMotionSchema): void {
    const fraction = staticMotion.current / staticMotion.duration;
    const position = staticMotion.path.getPointAt(fraction);
    const tangent = staticMotion.path.getTangentAt(fraction);

    const up = new Vector3(0, 1, 0);
    const axis = new Vector3();
    model.obj.position.copy(staticMotion.pos.clone().add(position));
    axis.crossVectors(up, tangent).normalize();
    model.obj.quaternion.setFromAxisAngle(axis, Math.acos(up.dot(tangent)));
  }

  private executeEntity(entity: Entity, delta: number): void {
    const staticMotion = entity.getMutableComponent(StaticMotion)! as any as StaticMotionSchema;
    const model = entity.getComponent(Model)! as any as ModelSchema;

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

  execute(delta: number): void {
    const added = this.queries.staticMotion.added!;
    for (const entity of added) {
      const model = entity.getComponent(Model)! as any as ModelSchema;
      const staticMotion = entity.getMutableComponent(StaticMotion)! as any as StaticMotionSchema;
      staticMotion.pos = model.obj.position.clone();
    }

    for (const entity of this.queries.staticMotion.results) {
      this.executeEntity(entity, delta);
    }
  }
}

StaticMotionSystem.queries = {
  staticMotion: {
    components: [
      StaticMotion,
      Model,
      Not(Body),
    ],
    listen: {
      added: true,
    },
  },
};
