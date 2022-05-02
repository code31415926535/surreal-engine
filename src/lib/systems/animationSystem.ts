import { Query, Entity, IterativeSystem } from 'tick-knock';
import Animation from '../components/animation';

export default class AnimationSystem extends IterativeSystem {
  constructor() {
    super(new Query(entity => entity.hasAll(Animation)));
  }

  public play(entity: Entity, animationName: string) {
    const animation = entity.get(Animation)!;
    const { action } = animation.animations[animationName];
    action.time = 0.0;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(1);
    action.enabled = true;
    if (animation.prevAnimation) {
      animation.prevAnimation.crossFadeTo(action, 0.5, true);
    }
    action.play();
    animation.prevAnimation = action;
  }

  protected updateEntity(entity: Entity, delta: number): void {
    const animation = entity.get(Animation)!;
    animation.mixer.update(delta * 0.001);
  }
}