import AmmoType from "ammojs-typed";
import { Entity, World } from "ecsy";
import { Object3D } from "three";
import Model from "../components/model";
import Body from "../components/body";
import { createModel, createRigidBody, ModelOptions, RigidBodyOptions } from "./util";

interface PrimitiveOptions {
  obj: Object3D;
  body?: AmmoType.btRigidBody;
}

export const createPrimitive = (world: World, opts: PrimitiveOptions): Entity => {
  const entity = world.createEntity()
    .addComponent(Model, { obj: opts.obj });
  
  if (opts.body) {
    entity.addComponent(Body, { obj: opts.body });
  }

  return entity;
}

export interface ShapeOptions extends ModelOptions, RigidBodyOptions {
  rigid?: boolean;
}

export const createShape = (world: World, opts: ShapeOptions): Entity => {
  const obj = createModel(opts);
  let body = undefined;
  
  if (opts.rigid) {
    body = createRigidBody(opts);
  };

  return createPrimitive(world, { obj, body });
}