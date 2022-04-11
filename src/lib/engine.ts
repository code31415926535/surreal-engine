import {
  PCFSoftShadowMap,
  WebGLRenderer,
  Camera,
  Scene,
  PerspectiveCamera,
} from 'three';

export default class Engine {
  private previousTime: number = 0;

  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: Camera;

  constructor(id: string) {
    if (! WebGLRenderer) {
      throw new Error('WebGL is not supported');
    }

    this.renderer = new WebGLRenderer({
      canvas: document.querySelector(id)!,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.scene = new Scene();

    // TODO: Remove
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      100,
    );
    this.camera.position.set(50, 50, 50);

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

  public start () {
    this.animate();
  }

  private animate() {
    requestAnimationFrame((t) => {
      if (this.previousTime === 0) {
        this.previousTime = t;
      }

      this.animate();
      this.render();
      this.update(t, t - this.previousTime);
      this.previousTime = t;
    });
  }

  private update(delta: number, time: number) {
    //
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}