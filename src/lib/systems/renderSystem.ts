import { Attributes, System } from "ecsy";
import {
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  GridHelper,
  AxesHelper,
  OrthographicCamera,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Model, { ModelSchema } from "../components/model";

export interface OrthographicCameraOptions {
  distance: number;
  near?: number;
  far?: number;
}

export interface PerspectiveCameraOptions {
  fov: number;
  near?: number;
  far?: number;
  position: { x: number; y: number; z: number };
  lookAt?: { x: number; y: number; z: number };
}

export default class RenderSystem extends System {
  private renderer!: WebGLRenderer;
  private scene!: Scene;
  public camera!: PerspectiveCamera | OrthographicCamera;
  private debug: boolean = false;

  public setOrthographicCamera(opts: OrthographicCameraOptions) {
    const aspect = window.innerWidth / window.innerHeight
    this.camera = new OrthographicCamera(
      -opts.distance * aspect,
      opts.distance * aspect,
      opts.distance,
      -opts.distance,
      opts.near || 1,
      opts.near || 1000);
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);

    if (this.debug) {
      new OrbitControls(this.camera, this.renderer.domElement);
    }
  }

  public setPerspectiveCamera(opts: PerspectiveCameraOptions) {
    this.camera = new PerspectiveCamera(
      opts.fov,
      window.innerWidth / window.innerHeight,
      opts.near || 0.1,
      opts.far || 1000,
    );
    this.camera.position.set(opts.position.x, opts.position.y, opts.position.z);
    this.camera.lookAt(opts.lookAt?.x || 0, opts.lookAt?.y || 0, opts.lookAt?.z || 0);

    if (this.debug) {
      new OrbitControls(this.camera, this.renderer.domElement);
    }
  }

  init(attributes: Attributes) {
    this.debug = attributes.debug;
    this.renderer = new WebGLRenderer({
      antialias: attributes.antialias,
      canvas: document.querySelector(attributes.canvas)!,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.scene = new Scene();

    this.setPerspectiveCamera({
      fov: 75,
      position: { x: 10, y: 10, z: 10 },
    });

    if (this.debug) {
      this.scene.add(new GridHelper(100, 10));
      this.scene.add(new AxesHelper(100));
    }

    window.addEventListener('resize', () => {
      this.onResize();
    });
  }

  private onResize() {
    if (this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  execute(): void {
    const added = this.queries.model.added!;
    for (const entity of added) {
      const model = entity.getComponent(Model)! as any as ModelSchema;
      this.scene.add(model.obj);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

RenderSystem.queries = {
  model: { 
    components: [ Model ],
    listen: {
      added: true,
    },
  },
}