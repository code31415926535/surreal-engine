import { Engine as ECSEngine } from 'tick-knock';
import { AmbientLight, DirectionalLight, Object3D, PointLight, Vector3 } from "three";
import EntityBuilder, { ShapeModelOptions, RigidBodyOptions, Object3DOptions, Model3DOptions } from "../utils/entityBuilder";
import AssetManager from './AssetManager';
import Widget from '../components/widget';
import { nanoid } from 'nanoid';
import Timer from '../components/timer';
import MaterialManager from './MaterialManager';
import SurrealMaterial from '../core/surrealMaterial';

interface ShapeOptions extends Omit<ShapeModelOptions, "material">, RigidBodyOptions {
  rigid?: boolean;
  material: string;
}

export interface BoxOptions extends Omit<ShapeOptions, "type"> {}

export interface SphereOptions extends Omit<ShapeOptions, "type" | "size"> {
  radius: number;
}

export interface CylinderOptions extends Omit<ShapeOptions, "type"> {}

export interface ModelOptions extends Omit<Model3DOptions, "model"> {
  model: string;
}

export interface EtherealOptions {
  obj: Object3D;
}

export interface AmbientLightOptions {
  color: string;
  intensity: number;
}

export interface PointLightOptions extends AmbientLightOptions {
  pos: Vector3;
  castShadow?: boolean;
  shadowResolution?: number;
  near?: number;
  far?: number;
}

export interface DirectionalLightOptions extends PointLightOptions {
  target: Vector3;
  shadowAreaWidth?: number;
  shadowAreaHeight?: number;
}

/**
 * EntityCreator is a helper class that helps you create entities.
 * Surreal Engine uses the Entity Component System (ECS). ECS is a
 * pattern that allows you to create entities and add components to
 * them.
 * 
 * Entities are dumb objects that contain components. Components are
 * small pieces of data that are attached to entities. They do not
 * contain any logic. Systems are responsible for updating components
 * and adding logic to entities.
 * 
 * @see https://en.wikipedia.org/wiki/Entity_component_system
 */
export default class EntityCreator {
  constructor(
    private ecs: ECSEngine,
    private assets: AssetManager,
    private materials: MaterialManager,
  ) {}

  /**
   * Creates an emtpy entity without any components.
   */
  empty(): EntityBuilder {
    return new EntityBuilder(this.ecs, this.assets);
  }

  /**
   * Creates an entity that only contains an Object3D.
   * 
   * @param opts {@link Object3DOptions} 
   * @returns {@link EntityBuilder}
   */
  ethereal(opts: Object3DOptions): EntityBuilder {
    return this.empty().withObject3D({ obj: opts.obj });
  }

  /**
   * Creates a widget entity. A widget is a building block used
   * to create the UI.
   * 
   * @param opts {@link any}
   * @returns {@link EntityBuilder}
   */
  widget(elem: JSX.Element): EntityBuilder {
    const id = nanoid();
    return this.empty().with(new Widget(id, elem));
  }

  /**
   * Creates an entity from a 3D model. **opts.model** is the name of
   * the model in the asset manager.
   * 
   * @param opts {@link ModelOptions}
   * @returns {@link EntityBuilder}
   */
  model(opts: ModelOptions): EntityBuilder {
    const obj = this.assets.getModel(opts.model);
    if (!obj) {
      throw new Error(`Model ${opts.model} not found`);
    }
    return this.empty().with3DModel({
      ...opts,
      model: obj,
    });
  }

  /**
   * Creates a box entity. If rigid is true, the entity will have a
   * rigid body.
   * 
   * @param opts {@link BoxOptions}
   * @returns {@link EntityBuilder}
   */
  box(opts: BoxOptions): EntityBuilder {
    const builder = this.empty()
      .withShapeModel({
        ...opts,
        type: 'box',
        material: this.getMaterial(opts.material),
      });
    
    if (opts.rigid) {
      builder.withRigidBody({ ...opts, type: 'box' });
    }

    return builder;
  }

  /**
   * Creates a sphere entity. If rigid is true, the entity will have a
   * rigid body.
   * 
   * @param opts {@link SphereOptions}
   * @returns {@link EntityBuilder}
   */
  sphere(opts: SphereOptions): EntityBuilder {
    const builder = this.empty()
      .withShapeModel({
        ...opts,
        type: 'sphere',
        size: new Vector3(opts.radius, opts.radius, opts.radius),
        material: this.getMaterial(opts.material),
      });
    
    if (opts.rigid) {
      builder.withRigidBody({ ...opts, type: 'sphere', size: new Vector3(opts.radius, opts.radius, opts.radius) });
    }

    return builder;
  }

  /**
   * Creates an ambient light entity. Ambient lights provide lighting
   * that is independent of the position of the light.
   * @see https://threejs.org/docs/#api/lights/AmbientLight
   * 
   * @param opts {@link DirectionalLightOptions}
   * @returns {@link EntityBuilder}
   */
  ambientLight(opts: AmbientLightOptions): EntityBuilder {
    const light = new AmbientLight(opts.color, opts.intensity);
    return this.ethereal({ obj: light });
  }

  pointLight(opts: PointLightOptions): EntityBuilder {
    const light = new PointLight(opts.color, opts.intensity);
    light.position.set(opts.pos.x, opts.pos.y, opts.pos.z);

    if (opts.castShadow) {
      light.castShadow = true;
      light.shadow.camera.near = opts.near || 0.5;
      light.shadow.camera.far = opts.far || 500;
      light.shadow.mapSize.width = opts.shadowResolution || 1024;
      light.shadow.mapSize.height = opts.shadowResolution || 1024;
    }

    return this.ethereal({ obj: light });
  }

  /**
   * Creates a directional light entity. Directional lights are
   * lights that shine in a specific direction. These lights can
   * cast shadows.
   * @see https://threejs.org/docs/#api/lights/DirectionalLight
   * 
   * @param opts {@link DirectionalLightOptions}
   * @returns {@link EntityBuilder}
   */
  directionalLight(opts: DirectionalLightOptions): EntityBuilder {
    const light = new DirectionalLight(opts.color, opts.intensity);
    light.position.set(opts.pos.x, opts.pos.y, opts.pos.z);
    light.target.position.set(opts.target.x, opts.target.y, opts.target.z);

    if (opts.castShadow) {
      light.castShadow = true;
      light.shadow.camera.near = opts.near || 0.5;
      light.shadow.camera.far = opts.far || 500;
      light.shadow.camera.left = opts.shadowAreaWidth ? -opts.shadowAreaWidth : -5;
      light.shadow.camera.right = opts.shadowAreaWidth || 5;
      light.shadow.camera.top = opts.shadowAreaHeight || 5;
      light.shadow.camera.bottom = opts.shadowAreaHeight ? -opts.shadowAreaHeight : -5;
      light.shadow.mapSize.width = opts.shadowResolution || 1024;
      light.shadow.mapSize.height = opts.shadowResolution || 1024;
    }

    return this.ethereal({ obj: light });
  }

  timer(callback: () => void, interval: number, repeat: boolean): EntityBuilder {
    return this.empty().with(new Timer(callback, interval, repeat));
  }

  private getMaterial(name: string): SurrealMaterial {
    const material = this.materials.getMaterial(name);
    if (!material) {
      throw new Error(`Material ${material} not found`);
    }
    return material;
  }
}