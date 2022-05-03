import { Query, Entity, IterativeSystem, EntitySnapshot } from 'tick-knock';
import Animation from '../components/animation';

export class SurrealAnimationEvent {
  constructor(public entity: Entity, public action: string) {}
}

export default class AnimationSystem extends IterativeSystem {
  constructor() {
    super(new Query(entity => entity.hasAll(Animation)));
  }

  public init() {
    this.engine.subscribe(SurrealAnimationEvent, (event: SurrealAnimationEvent) => {
      if (event.entity.has(Animation)) {
        event.entity.get(Animation)!.handle(event.action);
      }
    });
  }

  protected entityAdded = ({ current }: EntitySnapshot) => {
    current.get(Animation)!.mixer.addEventListener("finished", () => {
      this.dispatch(new SurrealAnimationEvent(current, "finished"));
    });
    current.get(Animation)!.mixer.addEventListener("loop", () => {
      this.dispatch(new SurrealAnimationEvent(current, "loop"));
    });
  }

  protected updateEntity(entity: Entity, delta: number): void {
    const animation = entity.get(Animation)!;
    animation.mixer.update(delta * 0.001);
  }
}