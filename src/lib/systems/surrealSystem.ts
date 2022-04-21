import { System } from "ecsy";
import PhysicsSystem from "./physicsSystem";
import RenderSystem from "./renderSystem";

export default abstract class SurrealSystem extends System {
  protected get physicsSystem(): PhysicsSystem {
    return this.world.getSystem(PhysicsSystem) as PhysicsSystem;
  }

  protected get renderSystem(): RenderSystem {
    return this.world.getSystem(RenderSystem) as RenderSystem;
  }
}