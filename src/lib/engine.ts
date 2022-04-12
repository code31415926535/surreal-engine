import { World } from 'ecsy';
import {
  WebGLRenderer,
} from 'three';
import Model from './components/model';
import Body from './components/body';
import EntityCreator from './entities';
import RenderSystem from './systems/renderSystem';
import PhysicsSystem from './systems/physicsSystem';
import PhysicsRendererSyncSystem from './systems/physicsRendererSyncSystem';

declare global {
  interface Window {
    Ammo: any;
    ammo: any;
  }
}

export default class Engine {
  private previousTime: number = 0;
  private world!: World;
  public creator!: EntityCreator;

  constructor(private canvas: string) {
    if (! WebGLRenderer) {
      throw new Error('WebGL is not supported');
    }
  }

  public async init() {
    window.ammo = await window.Ammo();
    this.world = new World({
      entityPoolSize: 1000,
    });
    this.world.registerComponent(Model);
    this.world.registerComponent(Body);
    this.world.registerSystem(RenderSystem, { canvas: this.canvas });
    this.world.registerSystem(PhysicsSystem, {})
    this.world.registerSystem(PhysicsRendererSyncSystem, {})
    this.creator = new EntityCreator(this.world);
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
      this.world.execute(t, t - this.previousTime);
      this.previousTime = t;
    });
  }
}