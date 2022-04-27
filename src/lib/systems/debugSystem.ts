import { Query, ReactionSystem } from "tick-knock";
import { DebugOptions } from "../core/debugOptions";
import { Engine } from "../surreal-engine";
import {
  GridHelper,
  AxesHelper,
} from 'three';
import RenderSystem from "./renderSystem";

export default class DebugSystem extends ReactionSystem {
  constructor(private debug: DebugOptions, private parent: Engine) {
    super(new Query(() => true));
  }

  init() {
    if (this.debug.axis) {
      this.parent.creator.ethereal({ obj: new AxesHelper(this.debug.axis.size) });
    }
    if (this.debug.grid) {
      this.parent.creator.ethereal({ obj: new GridHelper(this.debug.grid.size) });
    }
    if (this.debug.orbitControls) {
      // TODO: Subscribe for camera changes
      const rs = this.engine.getSystem(RenderSystem)!;
      rs.orbitControls();
    }
  }
}