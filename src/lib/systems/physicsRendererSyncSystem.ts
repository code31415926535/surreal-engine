import { Query, Entity, IterativeSystem } from 'tick-knock';
import Body from "../components/body";
import Model from "../components/model";

export default class PhysicsRendererSyncSystem extends IterativeSystem {
  constructor() {
    super(new Query(entity => entity.hasAll(Body, Model)));
  }

  protected updateEntity(entity: Entity): void {
    const model = entity.get(Model)!;
    model.mesh.position.copy(entity.get(Body)!.position);
    model.mesh.quaternion.copy(entity.get(Body)!.quaternion);
  }
}
