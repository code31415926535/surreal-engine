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

    // TODO: Make this work
    if (this.debug.boundingBox && model.boundingBox) {
      // model.computeBoundingBox();
      // if (model.boundingBox) {
      //   const b = new Mesh( new BoxGeometry(
      //     model.boundingBox.max.x - model.boundingBox.min.x,
      //     model.boundingBox.max.y - model.boundingBox.min.y,
      //     model.boundingBox.max.z - model.boundingBox.min.z,
      //   ), new MeshPhongMaterial({ color: 0x00ff00 }));
      //   b.applyMatrix4(model.mesh.matrixWorld);
      //   this.parent.creator.ethereal({ obj: b });
      // }
    }
  }
}