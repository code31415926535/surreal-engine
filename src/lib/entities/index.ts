import { World } from "ecsy";
import { createShape, ShapeOptions } from "./primitive";

export interface BoxOptions extends Omit<ShapeOptions, "type"> {}

export interface SphereOptions extends Omit<ShapeOptions, "type" | "size"> {
  radius: number;
}

export interface CylinderOptions extends Omit<ShapeOptions, "type"> {}

export default class EntityCreator {
  constructor(private world: World) {}

  box(opts: BoxOptions): EntityCreator {
    createShape(this.world, { ...opts, type: 'box' });
    return this;
  }

  sphere(opts: SphereOptions): EntityCreator {
    createShape(this.world, { ...opts, type: 'sphere', size: { x: opts.radius, y: opts.radius, z: opts.radius } });
    return this;
  }

  cylinder(opts: CylinderOptions): EntityCreator {
    throw new Error("Not working");
  }
}