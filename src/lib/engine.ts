import { World } from 'ecsy';
import {
  WebGLRenderer,
} from 'three';
import Model from './components/model';
import { createRigidBox } from './entities/rigidBody';
import RenderSystem from './systems/renderSystem';

// TODO: Entity creator
export default class Engine {
  private previousTime: number = 0;
  private world: World;

  constructor(canvas: string) {
    if (! WebGLRenderer) {
      throw new Error('WebGL is not supported');
    }

    this.world = new World({
      entityPoolSize: 1000,
    });
    this.world.registerComponent(Model);
    this.world.registerSystem(RenderSystem, { canvas });

    createRigidBox(this.world, { width: 1, height: 1, depth: 1});
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