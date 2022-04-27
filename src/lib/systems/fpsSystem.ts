import { System } from "tick-knock";
import { Engine } from "../surreal-engine";
import { FpsWidget } from "../widgets";

export default class FpsSystem extends System {
  private startTime!: number;
  private frames = 0;
  private widgetId!: number;

  constructor(private parent: Engine) {
    super();
  }

  init() {
    this.startTime = Date.now();
    this.widgetId = this.parent.creator.widget(FpsWidget({ fps: 0 })).id;
  }

  update(): void {
    this.frames ++;
    const avg = (Date.now() - this.startTime) / this.frames;
    const fps = Math.round(1000 / avg);
    // TODO: Very-very poor
    this.parent.manager.updateWidget(this.widgetId, FpsWidget({ fps }));
  }
}