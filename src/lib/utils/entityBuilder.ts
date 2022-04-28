import {
  Engine as ECSEngine,
  Entity,
} from 'tick-knock';
import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Mesh,
  Object3D,
  CurvePath,
  SphereGeometry,
  Vector3,
  Box3,
  Group,
} from "three";
// @ts-ignore
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import Ammo from "ammojs-typed";
import Model from "../components/model";
import Body from "../components/body";
import StaticMotion from "../components/staticMotion";
import AnimationController from "../controllers/animationController";
import KeyboardMotion from "../components/keyboardMotion";
import FollowCamera from '../components/followCamera';
import SurrealMaterial from "../core/surrealMaterial";
import Animation from '../components/animation';
import AssetManager from '../managers/AssetManager';

// TODO: Pos Quat Size unify
// TODO: Move to Vectory type

export interface PosQuat {
  pos?: { x: number, y: number, z: number };
  quat?: { x: number, y: number, z: number, w: number };
}

export interface RigidBodyOptions extends PosQuat {
  type: 'box' | 'sphere' | 'cylinder';
  size: { x: number; y: number; z: number };
  mass?: number;
  restitution?: number;
  friction?: number;
  linearDamping?: number;
  angularDamping?: number;
}

export interface ShapeModelOptions extends PosQuat {
  type: 'box' | 'sphere' | 'cylinder';
  size: { x: number; y: number; z: number };
  material: SurrealMaterial;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export interface Model3DOptions extends PosQuat {
  model: Object3D;
  size?: { x: number; y: number; z: number };
  offsetQuat?: { x: number; y: number; z: number; w: number };
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export interface AnimationOptions {
  initial: string;
  clips: [{
    name: string;
    clip: string;
  }]
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
  private entity: Entity;

  constructor(private ecs: ECSEngine, private assets: AssetManager) {
    this.entity = new Entity();
    this.ecs.addEntity(this.entity);
  }

  public withRigidBody = (opts: RigidBodyOptions): EntityBuilder => {
    this.entity.addComponent(new Body(this.buildRigidBody(opts)));
    return this;
  }

  public withBoundingBox = (): EntityBuilder => {
    const model = this.entity.get(Model);
    if (!model) {
      throw new Error('You must add a model to an entity before adding a bounding box');
    }
    model.computeBoundingBox();
    if (!model.boundingBox) {
      throw new Error('Model has no mesh to compute bounding box');
    }
    this.entity.addComponent(new Body(this.buildRigidBodyFromBox(model.boundingBox)));
    return this;
  }

  public withObject3D = (opts: Object3DOptions): EntityBuilder => {
    this.entity.addComponent(new Model(opts.obj));
    return this;
  }

  public withShapeModel = (opts: ShapeModelOptions): EntityBuilder => {
    this.entity.addComponent(new Model(this.buildShapeModel(opts)));
    return this;
  }

  public with3DModel = (opts: Model3DOptions): EntityBuilder => {
    this.entity.addComponent(new Model(this.build3DModel(opts)));
    return this;
  }

  public withAnimation = (opts: AnimationOptions): EntityBuilder => {
    const ctrl = new AnimationController(this.entity);
    opts.clips.forEach(clipName => {
      const clip = this.assets.getAnimation(clipName.clip);
      if (!clip) {
        throw new Error(`Animation ${clipName.clip} not found`);
      }
      ctrl.addAnimation(clipName.name, clip);
    });
    ctrl.play(opts.initial);
    this.entity.addComponent(new Animation(ctrl));
    return this;
  }

  public withKeyboardMotion = (opts?: KeyboardMotionOptions): EntityBuilder => {
    this.entity.addComponent(new KeyboardMotion(opts?.speed, opts?.rotation));
    return this;
  }

  public withOffsetCamera = (offset?: Vector3): EntityBuilder => {
    const idealOffset = offset || new Vector3(15, 15, 15);
    return this.withFollowCamera(new FollowCamera(new Vector3(), idealOffset, false));
  }

  /**
   * @param lookAt - The position to look at
   * @param offset - Offset from the center of the entity
   */
  public withThirdPersonCamera = (lookAt?: Vector3, offset?: Vector3): EntityBuilder => {
    const idealLookAt = lookAt || new Vector3(5, 2.5, 0);
    const idealOffset = offset || new Vector3(-15, 5, 0);
    return this.withFollowCamera(new FollowCamera(idealLookAt, idealOffset, true));
  }

  public withFollowCamera = (component: FollowCamera): EntityBuilder => {
    this.entity.addComponent(component);
    return this;
  }

  public with = (component: any): EntityBuilder => {
    this.entity.addComponent(component);
    return this;
  }

  public withStaticMotion = (opts: StaticMoitonOptions): EntityBuilder => {
    this.entity.addComponent(new StaticMotion(
      opts.path,
      opts.duration || 1000,
      opts.loop !== undefined ? opts.loop : true,
      new Vector3(),
    ));
    return this;
  }

  public get id(): number {
    return this.entity.id;
  }

  private buildRigidBodyFromBox = (box: Box3): Ammo.btRigidBody => {
    const opts: RigidBodyOptions = {
      type: 'box',
      size: {
        x: box.max.x - box.min.x,
        y: box.max.y - box.min.y,
        z: box.max.z - box.min.z,
      },
      pos: {
        x: box.min.x + (box.max.x - box.min.x) / 2,
        y: box.min.y + (box.max.y - box.min.y) / 2,
        z: box.min.z + (box.max.z - box.min.z) / 2,
      },
      quat: {
        x: 0,
        y: 0,
        z: 0,
        w: 1,
      },
      // TODO: What about this?
      mass: 1,
    }
    return this.buildRigidBody(opts);
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

  private build3DModel = (opts: Model3DOptions): Object3D => {
    const { model, pos, quat, size } = opts;
    const copy: Object3D = clone(model);
    copy.traverse(child => {
      if ((child as Mesh).isMesh) {
        (child as Mesh).castShadow = opts.castShadow || false;
        (child as Mesh).receiveShadow = opts.receiveShadow || false;
      }
    });
    if (pos) {
      copy.position.set(pos?.x || 0, pos?.y || 0, pos?.z || 0);
    }
    if (quat) {
      copy.quaternion.set(quat?.x || 0, quat?.y || 0, quat?.z || 0, quat?.w || 1);
    }
    if (size) {
      copy.scale.set(size?.x || 1, size?.y || 1, size?.z || 1);
    }
    if (opts.offsetQuat) {
      const group = new Group();
      group.position.copy(copy.position);
      group.quaternion.copy(copy.quaternion);
      group.scale.copy(copy.scale);
      copy.position.set(0, 0, 0);
      copy.quaternion.set(opts.offsetQuat.x, opts.offsetQuat.y, opts.offsetQuat.z, opts.offsetQuat.w);
      copy.scale.set(1, 1, 1);
      group.add(copy);
      return group;
    }
    return copy;
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