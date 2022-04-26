import { Query, Entity, IterativeSystem } from 'tick-knock';
import Animation from '../components/animation';

export default class AnimationSystem extends IterativeSystem {
  constructor() {
    super(new Query(entity => entity.hasAll(Animation)));
  }

  protected updateEntity(entity: Entity, delta: number): void {
    const animation = entity.get(Animation)!;
    animation.controller.update(delta);
  }
}