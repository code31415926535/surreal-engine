import AmmoType from "ammojs-typed";
import { Entity, World } from "ecsy";
import { Material, Object3D } from "three";
import Model from "../components/model";
import Body from "../components/body";
import { createBoxModel, createRigidBox } from "./util";

interface PrimitiveOptions {
  obj: Object3D;
  body?: AmmoType.btRigidBody;
}

const createPrimitive = (world: World, opts: PrimitiveOptions): Entity => {
  const entity = world.createEntity()
    .addComponent(Model, { obj: opts.obj });
  
  if (opts.body) {
    entity.addComponent(Body, { obj: opts.body });
  }

  return entity;
}

export interface BoxOptions {
  size: { x: number, y: number, z: number };
  pos?: { x: number; y: number; z: number };
  quat?: { x: number; y: number; z: number; w: number };
  mass?: number;
  restitution?: number;
  material?: Material;

  rigid?: boolean;
}

export const createBox = (world: World, opts: BoxOptions): Entity => {
  const obj = createBoxModel({
    size: opts.size,
    pos: opts.pos || { x: 0, y: 0, z: 0 },
    quat: opts.quat || { x: 0, y: 0, z: 0, w: 1 },
    material: opts.material,
  });
  let body = undefined;
  
  if (opts.rigid) {
    body = createRigidBox({
      size: opts.size,
      pos: opts.pos || { x: 0, y: 0, z: 0 },
      quat: opts.quat || { x: 0, y: 0, z: 0, w: 1 },
      mass: opts.mass,
      restitution: opts.restitution,
    });
  };

  return createPrimitive(world, { obj, body });
}