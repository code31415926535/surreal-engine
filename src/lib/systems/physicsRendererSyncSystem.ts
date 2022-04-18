import { System } from "ecsy";
import Body, { BodySchema } from "../components/body";
import Model, { ModelSchema } from "../components/model";
import Ammo from "ammojs-typed";

export default class PhysicsRendererSyncSystem extends System {
  execute(): void {
    const entities = this.queries.entities.results;
    for (const entity of entities) {
      const body = entity.getComponent(Body)! as any as BodySchema;
      const transform: Ammo.btTransform = new window.Ammo.btTransform();
      body.obj.getMotionState().getWorldTransform(transform);

      const model = entity.getComponent(Model)! as any as ModelSchema;
      model.obj.position.set(
        transform.getOrigin().x(),
        transform.getOrigin().y(),
        transform.getOrigin().z(),
      );
      model.obj.quaternion.set(
        transform.getRotation().x(),
        transform.getRotation().y(),
        transform.getRotation().z(),
        transform.getRotation().w(),
      );
    }
  }
}

PhysicsRendererSyncSystem.queries = {
  entities: {
    components: [ Body, Model ],
  }
}