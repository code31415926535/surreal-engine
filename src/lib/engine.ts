import { World } from 'ecsy';
import {
  WebGLRenderer,
} from 'three';
import Model from './components/model';
import Body from './components/body';
import EntityCreator from './entities';
import RenderSystem, { OrthographicCameraOptions, PerspectiveCameraOptions } from './systems/renderSystem';
import PhysicsSystem from './systems/physicsSystem';
import StaticMotionSystem from './systems/staticMotionSystem';
import PhysicsRendererSyncSystem from './systems/physicsRendererSyncSystem';
import StaticMotion from './components/staticMotion';
import KeyboardInput from './components/keyboardInput';
import KeyboardMovementSystem from './systems/keyboardMovementSystem';
import FollowCamera from './components/followCamera';
import FollowCameraSystem from './systems/followCameraSystem';

declare global {
  interface Window {
    Ammo: any;
    ammo: any;
  }
}

export interface EngineOpts {
  debug?: boolean;
  physics?: boolean;
  entityPoolSize?: number;
  gravity?: { x: number, y: number, z: number };
  antialias?: boolean;
}

export default class Engine {
  private previousTime: number = 0;
  private world!: World;
  public creator!: EntityCreator;

  private debug: boolean;
  private physics: boolean;
  private entityPoolSize: number;
  private gravity: { x: number; y: number; z: number; };
  private antialias: boolean;

  constructor(private canvas: string, opts?: EngineOpts) {
    if (! WebGLRenderer) {
      throw new Error('WebGL is not supported');
    }

    this.debug = opts?.debug ?? false;
    this.physics = opts?.physics ?? true;
    this.entityPoolSize = opts?.entityPoolSize ?? 1000;
    this.gravity = opts?.gravity ?? { x: 0, y: -0.98, z: 0 };
    this.antialias = opts?.antialias ?? true;
  }

  public async init() {
    window.ammo = await window.Ammo();
    this.world = new World({
      entityPoolSize: this.entityPoolSize,
    });
    this.world.registerComponent(Model);
    this.world.registerComponent(Body);
    this.world.registerComponent(StaticMotion);
    this.world.registerComponent(KeyboardInput);
    this.world.registerComponent(FollowCamera);
    this.world.registerSystem(RenderSystem, {
      canvas: this.canvas,
      debug: this.debug,
      antialias: this.antialias,
    });
    if (this.physics) {
      this.world.registerSystem(PhysicsSystem, { gravity: this.gravity });
      this.world.registerSystem(PhysicsRendererSyncSystem, {});
    }
    this.world.registerSystem(StaticMotionSystem, {});
    this.world.registerSystem(KeyboardMovementSystem, {});
    if (!this.debug) {
      this.world.registerSystem(FollowCameraSystem, {});
    }
    this.creator = new EntityCreator(this.world, this.debug);
  }

  public setPerspectiveCamera(opts: PerspectiveCameraOptions) {
    this.world.getSystem(RenderSystem).setPerspectiveCamera(opts);
  }

  public setOrthographicCamera(opts: OrthographicCameraOptions) {
    this.world.getSystem(RenderSystem).setOrthographicCamera(opts);
  }

  public start() {
    this.execute();
  }

  private execute() {
    requestAnimationFrame((t) => {
      if (this.previousTime === 0) {
        this.previousTime = t;
      }

      this.execute();
      this.world.execute(t - this.previousTime, t);
      this.previousTime = t;
    });
  }
}
