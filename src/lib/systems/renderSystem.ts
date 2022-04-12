import { Attributes, System } from "ecsy";
import {
  Camera,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import Model, { ModelSchema } from "../components/model";

export default class RenderSystem extends System {
  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private camera!: Camera;

  init(attributes: Attributes){
    this.renderer = new WebGLRenderer({
      canvas: document.querySelector(attributes.canvas)!,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.scene = new Scene();

    // TODO: Better way of handling this (Maybe have a camera component?)
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      100,
    );
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);

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