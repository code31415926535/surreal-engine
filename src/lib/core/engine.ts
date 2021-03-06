import {
  Class,
  Engine as ECSEngine, System,
} from 'tick-knock';
import {
  Vector3,
  WebGLRenderer,
} from 'three';
import AmmoType from 'ammojs-typed';
// @ts-ignore
import initAmmo from '../ammo.js';
import EntityCreator from '../managers/entityCreator';
import { BackgroundOptions, OrthographicCameraOptions, PerspectiveCameraOptions } from '../systems/renderSystem';
import AssetManager from '../managers/AssetManager';
import {
  PhysicsSystem,
  RenderSystem,
  PhysicsRendererSyncSystem,
  KeyboardMovementSystem,
  StaticMotionSystem,
  FollowCameraSystem,
  AnimationSystem,
  DebugSystem,
  FpsSystem,
  WidgetSystem,
  KeyboardInputSystem,
  TimerSystem,
} from '../systems';
import {
  ErrorWidget,
  ProgressWidget,
} from '../widgets';
import MaterialManager from '../managers/MaterialManager';
import EntityManager from '../managers/EntityManager';
import { DebugOptions } from './debugOptions';
import { Pass } from '../shadersAndPasses';

declare global {
  interface Window {
    Ammo: typeof AmmoType;
  }
}

export interface EngineOpts {
  debug?: DebugOptions;
  showFps?: boolean;
  gravity?: Vector3;
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
   *  size: new Vector3(1, 1, 1),
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
   * engine.assets.addTexture("floor", "textures/floor.png" });
   * await engine.assets.load();
   * const material = new MeshPhongMaterial({map: engine.assets.getTexture("floor")});
   */
  public assets!: AssetManager;

  /**
   * Material manager class. Use this to register and manage materials.
   * 
   * @example
   * engine.materials.addTexturedMaterial("floor", { texture: "floor" });
   * const material = engine.materials.getMaterial("floor");
   */
  public materials!: MaterialManager;

  /**
   * Entity manager class. Used to modify and remove entities.
   * 
   * @example
   * engine.manager.remove(id);
   */
  public manager!: EntityManager;

  public get systems() {
    return this.ecs.systems;
  }

  private previousTime: number = 0;
  private ecs!: ECSEngine;

  private debug: DebugOptions;
  private showFps: boolean;
  private physics: boolean;
  private gravity: Vector3;
  private antialias: boolean;

  constructor(private containerQuery: string, opts?: EngineOpts) {
    if (! WebGLRenderer) {
      throw new Error('WebGL is not supported');
    }

    this.debug = opts?.debug ?? {};
    this.showFps = opts?.showFps ?? false;
    this.physics = true;
    this.gravity = opts?.gravity ?? new Vector3(0, -0.98, 0),
    this.antialias = opts?.antialias ?? true;
  }

  /**
   * Initialize all the engine components. This must be called once
   *  before doing any other operations.
   */
  public async init() {
    window.Ammo = await initAmmo();
    this.ecs = new ECSEngine();

    // Core Systems
    this.ecs.addSystem(new RenderSystem(this.containerQuery, this.antialias), 1);
    if (this.physics) {
      this.ecs.addSystem(new PhysicsSystem(this.gravity), 2);
      this.ecs.addSystem(new PhysicsRendererSyncSystem(), 3);
    }
    this.ecs.addSystem(new StaticMotionSystem(), 4);
    this.ecs.addSystem(new AnimationSystem(), 5);
    this.ecs.addSystem(new WidgetSystem(this.containerQuery), 6);

    // Movement and Camera Systems
    this.ecs.addSystem(new KeyboardInputSystem(), 10);
    this.ecs.addSystem(new KeyboardMovementSystem(), 11);
    if (! this.debug.orbitControls) {
      this.ecs.addSystem(new FollowCameraSystem(), 20);
    }

    // Scripting systems
    this.ecs.addSystem(new TimerSystem(), 30);

    // Helper Systems
    if (this.showFps) {
      this.ecs.addSystem(new FpsSystem(this), 999);
    }
    if (this.debug) {
      this.ecs.addSystem(new DebugSystem(this.debug, this), 1000);
    }

    // TODO: There should be a better architecture for this.
    let errorWidget = -1;
    let widgetId = 0;
    this.assets = new AssetManager((percentage) => {
      if (percentage === 0) {
        widgetId = this.creator.widget(ProgressWidget({ percentage })).id;
      } else if (percentage === 1) {
        this.manager.remove(widgetId);
      } else {
        // TODO: This is quite bad performance-wise.
        if (this.manager.is(widgetId)) {
          this.manager.updateWidget(widgetId, ProgressWidget({ percentage }));
        }
      }
    }, (error) => {
      if (! this.manager.is(errorWidget)) {
        this.manager.remove(widgetId);
        errorWidget = this.creator.widget(ErrorWidget({ error })).id;
      }
    });
    this.manager = new EntityManager(this.ecs);
    this.materials = new MaterialManager(this.assets);
    this.creator = new EntityCreator(this.ecs, this.assets, this.materials);

    this.ecs.getSystem(AnimationSystem)!.init();
    if (this.showFps) {
      this.ecs.getSystem(FpsSystem)!.init();
    }
    if (this.debug) {
      this.ecs.getSystem(DebugSystem)!.init();
    }
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
   * Ads a post processing pass to the engine.
   * @see {@link https://threejs.org/docs/?q=post#manual/en/introduction/How-to-use-post-processing|Post Processing}
   * @param pass The post processing pass to add.
   */
  public addPostProcessing(pass: Pass) {
    this.ecs.getSystem(RenderSystem)!.addPostProcessing(pass);
  }

  /**
   * Register a system to the engine.
   * @param system The system to add.
   */
  public registerSystem(system: System) {
    this.ecs.addSystem(system);
  }

  /**
   * Get a system of the engine.
   */
  public getSystem<T extends System>(systemClass: Class<T>): T {
    const sys = this.ecs.getSystem(systemClass);
    if (! sys) {
      throw new Error('System not found');
    }
    return sys;
  }

  /**
   * Start the engine.
   */
  public start() {
    this.execute();
  }

  /**
   * Execute one frame of the engine.
   */
  public step(fps: number) {
    const frame = 1000 / fps;
    this.ecs.update(frame);
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
