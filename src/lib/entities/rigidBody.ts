import { Entity, World } from "ecsy"
import { BoxGeometry, Material, Mesh, MeshBasicMaterial, Object3D } from "three";
import Model from "../components/model";

interface RigidBodyOptions {
  obj: Object3D;
}

const createRigidBody = (world: World, opts: RigidBodyOptions): Entity => {
  return world.createEntity()
    .addComponent(Model, { obj: opts.obj });
}

interface RigidBoxOptions {
  width: number;
  height: number;
  depth: number;
  material?: Material;
}

export const createRigidBox = (world: World, opts: RigidBoxOptions): Entity => {
  const geometry = new BoxGeometry(opts.width, opts.height, opts.depth);
  const material = opts.material || new MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new Mesh(geometry, material);

  return createRigidBody(world, { obj: mesh });
}