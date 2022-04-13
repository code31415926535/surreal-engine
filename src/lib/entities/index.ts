import { World } from "ecsy";
import { Object3D } from "three";
import EntityBuilder, { ShapeModelOptions, RigidBodyOptions, Object3DOptions } from "./builder";

interface ShapeOptions extends ShapeModelOptions, RigidBodyOptions {
  rigid?: boolean;
}

export interface BoxOptions extends Omit<ShapeOptions, "type"> {}

export interface SphereOptions extends Omit<ShapeOptions, "type" | "size"> {
  radius: number;
}

export interface CylinderOptions extends Omit<ShapeOptions, "type"> {}

export interface EtherealOptions {
  obj: Object3D;
}

export default class EntityCreator {
  constructor(private world: World) {}

  empty(): EntityBuilder {
    return new EntityBuilder(this.world);
  }

  ethereal(opts: Object3DOptions): EntityBuilder {
    return new EntityBuilder(this.world).withObject3D({ obj: opts.obj });
  }

  box(opts: BoxOptions): EntityBuilder {
    const builder = new EntityBuilder(this.world)
      .withShapeModel({ ...opts, type: 'box' });
    
    if (opts.rigid) {
      builder.withRigidBody({ ...opts, type: 'box' });
    }

    return builder;
  }

  sphere(opts: SphereOptions): EntityBuilder {
    const builder = new EntityBuilder(this.world)
      .withShapeModel({ ...opts, type: 'sphere', size: { x: opts.radius, y: opts.radius, z: opts.radius } });
    
    if (opts.rigid) {
      builder.withRigidBody({ ...opts, type: 'sphere', size: { x: opts.radius, y: opts.radius, z: opts.radius } });
    }

    return builder;
  }
}