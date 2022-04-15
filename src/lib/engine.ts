import { World } from 'ecsy';
import {
  WebGLRenderer,
} from 'three';
import Model from './components/model';
import Body from './components/body';
import EntityCreator from './entities';
import RenderSystem, { BackgroundOptions, OrthographicCameraOptions, PerspectiveCameraOptions } from './systems/renderSystem';
import PhysicsSystem from './systems/physicsSystem';
import StaticMotionSystem from './systems/staticMotionSystem';
import PhysicsRendererSyncSystem from './systems/physicsRendererSyncSystem';
import StaticMotion from './components/staticMotion';
import KeyboardMotion from './components/keyboardInput';
import KeyboardMovementSystem from './systems/keyboardMovementSystem';
import FollowCamera from './components/followCamera';
import FollowCameraSystem from './systems/followCameraSystem';
import Assets from './loaders';

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

/**
 * Surreal Game Engine.
 *  // TODO: More docs.
 */
export default class Engine {
  /**
   * Entity creator helper. You can use this class to create entities.
   * 
   * @example
   * engine.creator.box({
   *  size: { x: 25, y: 1, z: 25 },
   *  mass: 0,
   *  restitution: 0.3,
   *  rigid: true,
   *  receiveShadow: true,
   *  castShadow: true,
   * });
   */
  public creator!: EntityCreator;
  /**
   * Asset manager class. Use this to register and manage assets.
   * 
   * @example
   * TODO: Example
   */
  public assets!: Assets;

  private previousTime: number = 0;
  private world!: World;

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

  /**
   * Initialize all the engine components. This must be called once
   *  before doing any other operations.
   */
  public async init() {
    window.ammo = await window.Ammo();
    this.world = new World({
      entityPoolSize: this.entityPoolSize,
    });
    this.world.registerComponent(Model);
    this.world.registerComponent(Body);
    this.world.registerComponent(StaticMotion);
    this.world.registerComponent(KeyboardMotion);
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

    this.assets = new Assets();
    this.creator = new EntityCreator(this.world, this.debug);
  }

  /**
   * Set the camera to a {@link https://threejs.org/docs/#api/cameras/PerspectiveCamera PerspectiveCamera} A perspective camera is
   * a projection mode is designed to mimic the way the human eye sees.
   * 
   * @param opts The options for the camera.
   */
  public setPerspectiveCamera(opts: PerspectiveCameraOptions) {
    this.world.getSystem(RenderSystem).setPerspectiveCamera(opts);
  }

  /**
   * Set the camera to an {@link https://threejs.org/docs/#api/cameras/OrthographicCamera OrthographicCamera} An orthographic camera is
   * a projection mode where an object's size in the rendered image stays constant regardless of its distance from the camera.
   * The most common use case is an isometric view.
   * 
   * @param opts The options for the camera.
   */
  public setOrthographicCamera(opts: OrthographicCameraOptions) {
    this.world.getSystem(RenderSystem).setOrthographicCamera(opts);
  }

  public setBackground(opts: BackgroundOptions) {
    this.world.getSystem(RenderSystem).setBackground(opts);
  }

  /**
   * Start the engine.
   */
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
