import { World } from "ecsy";
import { createBox, BoxOptions } from "./primitive";

export default class EntityCreator {
  constructor(private world: World) {}

  box(opts: BoxOptions): EntityCreator {
    createBox(this.world, opts);
    return this;
  }
}