import { ReactionSystem, Query, EntitySnapshot } from 'tick-knock';
import {
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  GridHelper,
  AxesHelper,
  OrthographicCamera,
  FogExp2,
  Color,
  Texture,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Model from "../components/model";

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

export interface BackgroundOptions {
  color?: string;
  fog?: {
    color: string;
    density: number;
  }
  skybox?: Texture;
}

export default class RenderSystem extends ReactionSystem {
  private renderer: WebGLRenderer;
  private scene: Scene;
  /**
   * Current camera being used by the system.
   */
  public camera!: PerspectiveCamera | OrthographicCamera;
  private debug: boolean = false;

  constructor(canvas: string, debug: boolean, antialias: boolean) {
    super(new Query(entity => entity.hasComponent(Model)));
    this.debug = debug;
    this.renderer = new WebGLRenderer({
      antialias,
      canvas: document.querySelector(canvas)!,
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

  /**
   * Set the camera to an {@link https://threejs.org/docs/#api/cameras/OrthographicCamera OrthographicCamera} An orthographic camera is
   * a projection mode where an object's size in the rendered image stays constant regardless of its distance from the camera.
   * The most common use case is an isometric view.
   * 
   * @param opts The options for the camera.
   */
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

  /**
   * Set the camera to a {@link https://threejs.org/docs/#api/cameras/PerspectiveCamera PerspectiveCamera} A perspective camera is
   * a projection mode is designed to mimic the way the human eye sees.
   * 
   * @param opts The options for the camera.
   */
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

  /**
   * Sets the background of the game. See {@link BackgroundOptions} for more info.
   * 
   * @param opts The options for the background.
   */
  public setBackground(opts: BackgroundOptions) {
    this.scene.background = new Color(opts.color || "#000000");

    if (opts.fog) {
      this.scene.fog = new FogExp2(opts.fog.color, opts.fog.density);
    }

    if (opts.skybox) {
      this.scene.background = opts.skybox;
    }
  }

  private onResize() {
    if (this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public update(): void {
    this.renderer.render(this.scene, this.camera);
  }

  protected entityAdded = ({ current }: EntitySnapshot) => {
    this.scene.add(current.get(Model)!.mesh);
  }

  protected entityRemoved = ({ previous }: EntitySnapshot) => {
    this.scene.remove(previous.get(Model)!.mesh);
  }
}
