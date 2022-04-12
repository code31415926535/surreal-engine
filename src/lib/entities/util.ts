import { BoxGeometry, BufferGeometry, CylinderGeometry, Material, Mesh, MeshPhongMaterial, SphereGeometry } from "three";
import AmmoType from "ammojs-typed";

export interface RigidBodyOptions {
  type: 'box' | 'sphere' | 'cylinder';
  pos?: { x: number; y: number; z: number };
  quat?: { x: number; y: number; z: number; w: number };
  size: { x: number; y: number; z: number };
  mass?: number;
  restitution?: number;
}

const buildShape = (opts: RigidBodyOptions): any => {
  const btSize = new window.Ammo.btVector3(opts.size.x * 0.5, opts.size.y * 0.5, opts.size.z * 0.5);
  switch (opts.type) {
    case 'box':
      return new window.Ammo.btBoxShape(btSize);
    case 'sphere':
      return new window.Ammo.btSphereShape(opts.size.x / 2);
    case 'cylinder':
      return new window.Ammo.btCylinderShape(btSize);
    default:
      throw new Error(`Unknown shape type: ${opts.type}`);
  }
}

export const createRigidBody = (opts: RigidBodyOptions): AmmoType.btRigidBody => {
  const { pos, quat, mass, restitution } = opts;
  const transform = new window.Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new window.Ammo.btVector3(pos?.x || 0, pos?.y || 0, pos?.z || 0));
  transform.setRotation(new window.Ammo.btQuaternion(quat?.x || 0, quat?.y || 0, quat?.z || 0, quat?.w || 1));
  const motionState = new window.Ammo.btDefaultMotionState(transform);

  const shape = buildShape(opts);
  shape.setMargin(0.05);

  const inertia = new window.Ammo.btVector3(0, 0, 0);
  if (mass && mass > 0) {
    shape.calculateLocalInertia(mass, inertia);
  }

  const info = new window.Ammo.btRigidBodyConstructionInfo(mass || 0, motionState, shape, inertia);
  const body: AmmoType.btRigidBody = new window.Ammo.btRigidBody(info);
  body.setRestitution(restitution || 0);

  return body;
}

export interface ModelOptions {
  type: 'box' | 'sphere' | 'cylinder';
  size: { x: number; y: number; z: number };
  pos?: { x: number; y: number; z: number };
  quat?: { x: number; y: number; z: number; w: number };
  material?: Material;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

const buildGeometry = (opts: ModelOptions): BufferGeometry => {
  switch (opts.type) {
    case 'box':
      return new BoxGeometry(opts.size.x, opts.size.y, opts.size.z);
    case 'sphere':
      return new SphereGeometry(opts.size.x / 2, 32, 32);
    case 'cylinder':
      return new CylinderGeometry(opts.size.x, opts.size.y, opts.size.z);
    default:
      throw new Error(`Unknown shape type: ${opts.type}`);
  }
}

export const createModel = (opts: ModelOptions) => {
  const geometry = buildGeometry(opts);
  const material = opts.material || new MeshPhongMaterial({ color: 0xffffff });
  const mesh = new Mesh(geometry, material);
  mesh.castShadow = opts.castShadow || false;
  mesh.receiveShadow = opts.receiveShadow || false;
  
  mesh.position.set(opts.pos?.x || 0, opts.pos?.y || 0, opts.pos?.z || 0);
  mesh.quaternion.set(opts.quat?.x || 0, opts.quat?.y || 0, opts.quat?.z || 0, opts.quat?.w || 1);

  return mesh;
}