import { EntitySnapshot, Query, ReactionSystem } from "tick-knock";
import { DebugOptions } from "../core/debugOptions";
import { Engine } from "../surreal-engine";
import {
  GridHelper,
  AxesHelper,
  Material,
  Mesh,
  MeshPhongMaterial,
} from 'three';
import RenderSystem from "./renderSystem";
import Model from "../components/model";
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
      // TODO: Subscribe for camera changes
      const rs = this.engine.getSystem(RenderSystem)!;
      rs.orbitControls();
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
  }
}