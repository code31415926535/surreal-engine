import Body from "../components/body";
import Model, { ModelSchema } from "../components/model";
import { getPosition, getQuaternion } from "../entityUtils";
import SurrealSystem from "./surrealSystem";

export default class PhysicsRendererSyncSystem extends SurrealSystem {
  execute(): void {
    const entities = this.queries.entities.results;
    for (const entity of entities) {
      const model = entity.getComponent(Model)! as any as ModelSchema;
      model.obj.position.copy(getPosition(entity));
      model.obj.quaternion.copy(getQuaternion(entity));
    }
  }
}

PhysicsRendererSyncSystem.queries = {
  entities: {
    components: [ Body, Model ],
  }
}