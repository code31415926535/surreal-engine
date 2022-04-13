import { World } from "ecsy";
import { AmbientLight, CameraHelper, DirectionalLight, DirectionalLightHelper, Object3D, PointLight, PointLightHelper } from "three";
import EntityBuilder, { ShapeModelOptions, RigidBodyOptions, Object3DOptions } from "./builder";

interface ShapeOptions extends ShapeModelOptions, RigidBodyOptions {
  rigid?: boolean;
}

export interface BoxOptions extends Omit<ShapeOptions, "type"> {}

export interface SphereOptions extends Omit<ShapeOptions, "type" | "size"> {
  radius: number;
}

export interface CylinderOptions extends Omit<ShapeOptions, "type"> {}

export interface EtherealOptions {
  obj: Object3D;
}

export interface AmbientLightOptions {
  color: string;
  intensity: number;
}

export interface PointLightOptions extends AmbientLightOptions {
  pos: { x: number; y: number; z: number };
  castShadow?: boolean;
  shadowResolution?: number;
  near?: number;
  far?: number;
}

export interface DirectionalLightOptions extends PointLightOptions {
  target: { x: number; y: number; z: number };
  shadowAreaWidth?: number;
  shadowAreaHeight?: number;
}

export default class EntityCreator {
  constructor(private world: World, private debug: boolean) {}

  empty(): EntityBuilder {
    return new EntityBuilder(this.world);
  }

  ethereal(opts: Object3DOptions): EntityBuilder {
    return new EntityBuilder(this.world).withObject3D({ obj: opts.obj });
  }

  box(opts: BoxOptions): EntityBuilder {
    const builder = new EntityBuilder(this.world)
      .withShapeModel({ ...opts, type: 'box' });
    
    if (opts.rigid) {
      builder.withRigidBody({ ...opts, type: 'box' });
    }

    return builder;
  }

  sphere(opts: SphereOptions): EntityBuilder {
    const builder = new EntityBuilder(this.world)
      .withShapeModel({ ...opts, type: 'sphere', size: { x: opts.radius, y: opts.radius, z: opts.radius } });
    
    if (opts.rigid) {
      builder.withRigidBody({ ...opts, type: 'sphere', size: { x: opts.radius, y: opts.radius, z: opts.radius } });
    }

    return builder;
  }

  ambientLight(opts: AmbientLightOptions): EntityBuilder {
    const light = new AmbientLight(opts.color, opts.intensity);
    return this.ethereal({ obj: light });
  }

  pointLight(opts: PointLightOptions): EntityBuilder {
    const light = new PointLight(opts.color, opts.intensity);
    light.position.set(opts.pos.x, opts.pos.y, opts.pos.z);

    if (this.debug) {
      const helper = new PointLightHelper(light);
      this.ethereal({ obj: helper });
    }

    if (opts.castShadow) {
      light.castShadow = true;
      light.shadow.camera.near = opts.near || 0.5;
      light.shadow.camera.far = opts.far || 500;
      light.shadow.mapSize.width = opts.shadowResolution || 1024;
      light.shadow.mapSize.height = opts.shadowResolution || 1024;
    }

    return this.ethereal({ obj: light });
  }

  directionalLight(opts: DirectionalLightOptions): EntityBuilder {
    const light = new DirectionalLight(opts.color, opts.intensity);
    light.position.set(opts.pos.x, opts.pos.y, opts.pos.z);
    light.target.position.set(opts.target.x, opts.target.y, opts.target.z);

    if (this.debug) {
      const helper = new DirectionalLightHelper(light);
      this.ethereal({ obj: helper });
    }

    if (opts.castShadow) {
      light.castShadow = true;
      console.log(light.shadow.camera)
      light.shadow.camera.near = opts.near || 0.5;
      light.shadow.camera.far = opts.far || 500;
      light.shadow.camera.left = opts.shadowAreaWidth ? -opts.shadowAreaWidth : -5;
      light.shadow.camera.right = opts.shadowAreaWidth || 5;
      light.shadow.camera.top = opts.shadowAreaHeight || 5;
      light.shadow.camera.bottom = opts.shadowAreaHeight ? -opts.shadowAreaHeight : -5;
      light.shadow.mapSize.width = opts.shadowResolution || 1024;
      light.shadow.mapSize.height = opts.shadowResolution || 1024;

      if (this.debug) {
        const helper = new CameraHelper(light.shadow.camera);
        this.ethereal({ obj: helper });
      }
    }

    return this.ethereal({ obj: light });
  }
}