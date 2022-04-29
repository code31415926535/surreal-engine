import { EntitySnapshot, Query, ReactionSystem } from "tick-knock";
import { DebugOptions } from "../core/debugOptions";
import { Engine } from "../surreal-engine";
import {
  GridHelper,
  AxesHelper,
  Material,
  Mesh,
  MeshPhongMaterial,
  CameraHelper,
  DirectionalLight,
  PointLightHelper,
  PointLight,
} from 'three';
import RenderSystem, { CameraChangedEvent } from "./renderSystem";
import Model from "../components/model";
// @ts-ignore
import { getHelperFromSkeleton } from 'three/examples/jsm/utils/SkeletonUtils';

export default class DebugSystem extends ReactionSystem {
  constructor(private debug: DebugOptions, private parent: Engine) {
    super(new Query((entity) => entity.hasAny(Model)));
  }

  init() {
    if (this.debug.axis) {
      this.parent.creator.ethereal({ obj: new AxesHelper(this.debug.axis.size) });
    }
    if (this.debug.grid) {
      this.parent.creator.ethereal({ obj: new GridHelper(this.debug.grid.size) });
    }
    if (this.debug.orbitControls) {
      const rs = this.engine.getSystem(RenderSystem)!;
      rs.orbitControls();
      this.engine.subscribe(CameraChangedEvent, () => {
        rs.orbitControls();
      });
    }
  }

  protected entityAdded = ({ current }: EntitySnapshot) => {
    const model = current.get(Model)!;

    if (this.debug.wireframe) {
      model.mesh.traverse((child) => {
        if ((child as Mesh).isMesh || child.type === 'Mesh') {
          const mat = (child as Mesh).material;
          if (['MeshPhongMaterial', 'MeshStandardMatrial', 'MeshPhysicalMaterial'].includes((mat as Material).type)) {
            (mat as MeshPhongMaterial).wireframe = true;
          }
        }
      });
    }

    if (this.debug.skeleton) {
      const skeleton = model.skeleton;
      if (skeleton) {
        const helper = getHelperFromSkeleton(skeleton);
        this.parent.creator.ethereal({ obj: helper });
      }
    }

    if (this.debug.light) {
      if (model.mesh.type === 'DirectionalLight') {
        const helper = new CameraHelper((model.mesh as DirectionalLight).shadow.camera);
        this.parent.creator.ethereal({ obj: helper });
      }
      if (model.mesh.type === 'PointLight') {
        const helper = new PointLightHelper(model.mesh as PointLight);
        this.parent.creator.ethereal({ obj: helper });
      }
    }
  }
}