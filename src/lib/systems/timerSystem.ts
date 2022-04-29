import { Entity, EntitySnapshot, IterativeSystem, Query } from "tick-knock";
import Timer from "../components/timer";

export default class TimerSystem extends IterativeSystem {
  private timers: { [id: string]: number } = {};

  constructor() {
    super(new Query((entity) => entity.has(Timer)));
  }

  protected entityAdded = ({ current }: EntitySnapshot) => {
    const timer = current.get(Timer)!;
    this.timers[timer.id] = 0;
  }

  protected updateEntity(entity: Entity, dt: number): void {
    const timer = entity.get(Timer)!;
    this.timers[timer.id] += dt;
    if (this.timers[timer.id] >= timer.interval) {
      this.timers[timer.id] = 0;
      timer.callback(this);
      if (!timer.repeat) {
        entity.remove(Timer);
      }
    }
  }
}