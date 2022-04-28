import { Entity, EntitySnapshot, ReactionSystem } from "tick-knock";

/**
 * A system that can only operate on one entity. This is useful for camera and
 * movement systems as they can only operate on one entity at a time.
 *
 * @see KeyboardMovementSystem
 */
export default abstract class SingleEntitySystem extends ReactionSystem {
  private entity: Entity | undefined;

  protected entityAdded = ({ current }: EntitySnapshot) => {
    if (!this.entity) {
      this.init();
    }
    this.entity = current;
  }

  protected init() {}
  protected abstract updateEntity(entity: Entity, dt: number): void;

  public update(dt: number): void {
    if (!this.entity) {
      return;
    }

    this.updateEntity(this.entity, dt);    
  }

  protected entityRemoved = () => {
    this.entity = undefined;
  }
}