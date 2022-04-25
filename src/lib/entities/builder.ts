import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Mesh,
  Object3D,
  CurvePath,
  SphereGeometry,
  Vector3,
} from "three";
import Ammo from "ammojs-typed";
import { Component, ComponentConstructor, Entity, World } from "ecsy";
import Model from "../components/model";
import Body from "../components/body";
import StaticMotion from "../components/staticMotion";
import KeyboardInputManager from "../input/keyboardInputManager";
import KeyboardMotion from "../components/keyboardInput";
import FollowCamera, { FollowCameraSchema } from '../components/followCamera';
import SurrealMaterial from "../core/surrealMaterial";

export interface RigidBodyOptions {
  type: 'box' | 'sphere' | 'cylinder';
  pos?: { x: number; y: number; z: number };
  quat?: { x: number; y: number; z: number; w: number };
  size: { x: number; y: number; z: number };
  mass?: number;
  restitution?: number;
  friction?: number;
  linearDamping?: number;
  angularDamping?: number;
}

export interface ShapeModelOptions {
  type: 'box' | 'sphere' | 'cylinder';
  size: { x: number; y: number; z: number };
  pos?: { x: number; y: number; z: number };
  quat?: { x: number; y: number; z: number; w: number };
  material: SurrealMaterial;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export interface Object3DOptions {
  obj: Object3D;
}

export interface StaticMoitonOptions {
  path: CurvePath<Vector3>;
  duration?: number;
  loop?: boolean;
}

export interface KeyboardMotionOptions {
  speed?: number;
  rotation?: number;
}

export default class EntityBuilder {
  entity: Entity;

  constructor(private world: World) {
    this.entity = this.world.createEntity();
  }

  public withRigidBody = (opts: RigidBodyOptions): EntityBuilder => {
    this.entity.addComponent(Body, { obj: this.buildRigidBody(opts) });
    return this;
  }

  public withObject3D = (opts: Object3DOptions): EntityBuilder => {
    this.entity.addComponent(Model, { obj: opts.obj });
    return this;
  }

  public withShapeModel = (opts: ShapeModelOptions): EntityBuilder => {
    this.entity.addComponent(Model, { obj: this.buildShapeModel(opts) });
    return this;
  }

  public withKeyboardMotion = (opts?: KeyboardMotionOptions): EntityBuilder => {
    this.entity.addComponent(KeyboardMotion, {
      value:  new KeyboardInputManager(),
      speed: opts?.speed || 1,
      rotation: opts?.rotation || 1,
    });
    return this;
  }

  // TODO: Make this configurable
  public withOffsetCamera = (): EntityBuilder => {
    const idealOffset = new Vector3(15, 15, 15);
    return this.withFollowCamera({
      idealLookAt: new Vector3(),
      idealOffset,
      followRotation: false,
    }) 
  }

  // TODO: Make this configurable
  public withThirdPersonCamera = (): EntityBuilder => {
    const idealLookAt = new Vector3(5, 2.5, 0);
    const idealOffset = new Vector3(-15, 5, 0);
    return this.withFollowCamera({ idealLookAt, idealOffset, followRotation: true });
  }

  public withFollowCamera = (opts: FollowCameraSchema): EntityBuilder => {
    this.entity.addComponent(FollowCamera, opts);
    return this;
  }

  public with = <C extends Component<any>>(
    Component: ComponentConstructor<C>,
    values?: Partial<Omit<C, keyof Component<any>>>
  ): EntityBuilder => {
    this.entity.addComponent(Component, values);
    return this;
  }

  public withStaticMotion = (opts: StaticMoitonOptions): EntityBuilder => {
    this.entity.addComponent(StaticMotion, {
      path: opts.path,
      duration: opts.duration || 1000,
      loop: opts.loop !== undefined ? opts.loop : true,
    });
    return this;
  }

  private buildRigidBody = (opts: RigidBodyOptions): Ammo.btRigidBody => {
    const { pos, quat, mass, restitution } = opts;
    const transform = new window.Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new window.Ammo.btVector3(pos?.x || 0, pos?.y || 0, pos?.z || 0));
    transform.setRotation(new window.Ammo.btQuaternion(quat?.x || 0, quat?.y || 0, quat?.z || 0, quat?.w || 1));
    const motionState = new window.Ammo.btDefaultMotionState(transform);
  
    const shape = this.buildRigidBodyShape(opts);
    shape.setMargin(0.05);
  
    const inertia = new window.Ammo.btVector3(0, 0, 0);
    if (mass && mass > 0) {
      shape.calculateLocalInertia(mass, inertia);
    }
  
    const info = new window.Ammo.btRigidBodyConstructionInfo(mass || 0, motionState, shape, inertia);
    const body: Ammo.btRigidBody = new window.Ammo.btRigidBody(info);
    body.setRestitution(restitution || 0);
    body.setFriction(opts.friction || 0.1);
    body.setDamping(opts.linearDamping || 0.1, opts.angularDamping || 0.1);
    body.setActivationState(4);

    return body;
  }

  private buildShapeModel = (opts: ShapeModelOptions) => {
    const geometry = this.buildGeometry(opts);
    const surrealMaterial = opts.material;
    const mesh = new Mesh(geometry, surrealMaterial.material);
    mesh.castShadow = opts.castShadow || false;
    mesh.receiveShadow = opts.receiveShadow || false;
    
    mesh.position.set(opts.pos?.x || 0, opts.pos?.y || 0, opts.pos?.z || 0);
    mesh.quaternion.set(opts.quat?.x || 0, opts.quat?.y || 0, opts.quat?.z || 0, opts.quat?.w || 1);
  
    return mesh;
  }

  private buildGeometry = (opts: ShapeModelOptions): BufferGeometry => {
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

  private buildRigidBodyShape = (opts: RigidBodyOptions): any => {
    const btSize = new window.Ammo.btVector3(opts.size.x * 0.5, opts.size.y * 0.5, opts.size.z * 0.5);
    switch (opts.type) {
      case 'box':
        return new window.Ammo.btBoxShape(btSize);
      case 'sphere':
        return new window.Ammo.btSphereShape(opts.size.x * 0.5);
      case 'cylinder':
        return new window.Ammo.btCylinderShape(btSize);
      default:
        throw new Error(`Unknown shape type: ${opts.type}`);
    }
  }
}