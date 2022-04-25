import {
  Engine as ECSEngine,
} from 'tick-knock';
import {
  WebGLRenderer,
} from 'three';
import EntityCreator from './managers/EntityCreator';
import RenderSystem, { BackgroundOptions, OrthographicCameraOptions, PerspectiveCameraOptions } from './systems/renderSystem';
import PhysicsSystem from './systems/physicsSystem';
import StaticMotionSystem from './systems/staticMotionSystem';
import PhysicsRendererSyncSystem from './systems/physicsRendererSyncSystem';
import KeyboardMovementSystem from './systems/keyboardMovementSystem';
import AssetManager from './managers/AssetManager';
import AmmoType from 'ammojs-typed';
import FollowCameraSystem from './systems/followCameraSystem';
// @ts-ignore
import initAmmo from './ammo.js';
import MaterialManager from './managers/MaterialManager';

declare global {
  interface Window {
    Ammo: typeof AmmoType;
  }
}

export interface EngineOpts {
  debug?: boolean;
  physics?: boolean;
  gravity?: { x: number, y: number, z: number };
  antialias?: boolean;
}

/**
 * Surreal Game Engine.
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
   * engine.assets.addTexture("floor", "textures/floor.png", { repeat: { x: 5, y: 5 } });
   * await engine.assets.load();
   * const material = new MeshPhongMaterial({map: engine.assets.getTexture("floor")});
   */
  public assets!: AssetManager;
  // TODO: Document
  public materials!: MaterialManager;

  private previousTime: number = 0;
  private ecs!: ECSEngine;

  private debug: boolean;
  private physics: boolean;
  private gravity: { x: number; y: number; z: number; };
  private antialias: boolean;

  constructor(private canvas: string, opts?: EngineOpts) {
    if (! WebGLRenderer) {
      throw new Error('WebGL is not supported');
    }

    this.debug = opts?.debug ?? false;
    this.physics = opts?.physics ?? true;
    this.gravity = opts?.gravity ?? { x: 0, y: -0.98, z: 0 };
    this.antialias = opts?.antialias ?? true;
  }

  /**
   * Initialize all the engine components. This must be called once
   *  before doing any other operations.
   */
  public async init() {
    window.Ammo = await initAmmo();
    this.ecs = new ECSEngine();
    this.ecs.addSystem(new RenderSystem(this.canvas, this.debug, this.antialias), 1);
    if (this.physics) {
      this.ecs.addSystem(new PhysicsSystem(this.gravity), 2);
      this.ecs.addSystem(new PhysicsRendererSyncSystem(), 3);
    }
    this.ecs.addSystem(new StaticMotionSystem(), 4);
    this.ecs.addSystem(new KeyboardMovementSystem(), 5);
    if (!this.debug) {
      this.ecs.addSystem(new FollowCameraSystem(), 6);
    }

    this.assets = new AssetManager();
    this.creator = new EntityCreator(this.ecs, this.debug);
    this.materials = new MaterialManager(this.assets);
  }

  /**
   * Set the camera to a {@link https://threejs.org/docs/#api/cameras/PerspectiveCamera PerspectiveCamera} A perspective camera is
   * a projection mode is designed to mimic the way the human eye sees.
   * 
   * @param opts The options for the camera.
   */
  public setPerspectiveCamera(opts: PerspectiveCameraOptions) {
    this.ecs.getSystem(RenderSystem)!.setPerspectiveCamera(opts);
  }

  /**
   * Set the camera to an {@link https://threejs.org/docs/#api/cameras/OrthographicCamera OrthographicCamera} An orthographic camera is
   * a projection mode where an object's size in the rendered image stays constant regardless of its distance from the camera.
   * The most common use case is an isometric view.
   * 
   * @param opts The options for the camera.
   */
  public setOrthographicCamera(opts: OrthographicCameraOptions) {
    this.ecs.getSystem(RenderSystem)!.setOrthographicCamera(opts);
  }

  /**
   * Sets the background of the game. See {@link BackgroundOptions} for more info.
   * 
   * @param opts The options for the background.
   */
  public setBackground(opts: BackgroundOptions) {
    this.ecs.getSystem(RenderSystem)!.setBackground(opts);
  }

  /**
   * Register a system to the engine.
   * @param system The system to add.
   * 
   * TODO: Make this work with proper priority.
   */
  public registerSystem(system: any) {
    this.ecs.addSystem(system);
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
      this.ecs.update(t - this.previousTime);
      this.previousTime = t;
    });
  }
}
