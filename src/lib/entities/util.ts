import { BoxGeometry, Material, Mesh, MeshBasicMaterial } from "three";
import AmmoType from "ammojs-typed";

export interface RigidBodyOptions {
  pos: { x: number; y: number; z: number };
  quat: { x: number; y: number; z: number; w: number };
  size: { x: number; y: number; z: number };
  mass?: number;
}

export const createRigidBox = (opts: RigidBodyOptions): AmmoType.btRigidBody => {
  const { pos, quat, size, mass } = opts;
  const transform = new window.Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new window.Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new window.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  const motionState = new window.Ammo.btDefaultMotionState(transform);

  const btSize = new window.Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
  // TODO: Maybe reusable
  const shape = new window.Ammo.btBoxShape(btSize);
  shape.setMargin(0.05)

  const inertia = new window.Ammo.btVector3(0, 0, 0);
  if (mass && mass > 0) {
    shape.calculateLocalInertia(mass, inertia);
  }

  const info = new window.Ammo.btRigidBodyConstructionInfo(mass || 0, motionState, shape, inertia);
  const body = new window.Ammo.btRigidBody(info);

  window.Ammo.destroy(btSize);

  return body;
}

export interface BoxOptions {
  size: { x: number; y: number; z: number };
  pos: { x: number; y: number; z: number };
  quat: { x: number; y: number; z: number; w: number };
  material?: Material;
}

export const createBoxModel = (opts: BoxOptions) => {
  const geometry = new BoxGeometry(opts.size.x, opts.size.y, opts.size.z);
  const material = opts.material || new MeshBasicMaterial({ color: 0xffffff });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(opts.pos.x, opts.pos.y, opts.pos.z);
  mesh.quaternion.set(opts.quat.x, opts.quat.y, opts.quat.z, opts.quat.w);

  return mesh;
}