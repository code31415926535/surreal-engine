import './style.css';
import Engine from "./lib/engine";
import { DirectionalLight, DirectionalLightHelper, MeshPhongMaterial, Vector3 } from 'three';

const engine = new Engine('#demo', {
  debug: true,
});
await engine.init();

const light = new DirectionalLight(0xffffff);
light.position.set(25, 25, 25);
light.position.applyAxisAngle(new Vector3(0.6, 1, 0), - Math.PI / 6);
light.target.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.bias = 0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 1;
light.shadow.camera.far = 500;
light.shadow.camera.left = 200;
light.shadow.camera.right = -200;
light.shadow.camera.top = 200;
light.shadow.camera.bottom = -200;

const drh = new DirectionalLightHelper(light, 10);

engine.creator.ethereal({
  obj: light,
});
engine.creator.ethereal({ obj: drh });

engine.creator.box({
  size: { x: 25, y: 1, z: 25 },
  mass: 0,
  restitution: 0.3,
  rigid: true,
  receiveShadow: true,
});
engine.creator.box({
  size: { x: 1, y: 1, z: 1 },
  pos: { x: 0, y: 10, z: 0 },
  mass: 0.5,
  restitution: 0.3,
  material: new MeshPhongMaterial({ color: 0xffcc00 }),
  rigid: true,
  castShadow: true,
});
engine.creator.box({
  size: { x: 1, y: 1, z: 1 },
  pos: {x: 0.5, y: 15, z: 0},
  mass: 1,
  restitution: 0.3,
  material: new MeshPhongMaterial({ color: 0x00ffcc }),
  rigid: true,
  castShadow: true,
});
engine.creator.sphere({
  radius: 1,
  pos: {x: 0, y: 20, z: 0},
  mass: 1,
  restitution: 0.3,
  material: new MeshPhongMaterial({ color: 0xccff00 }),
  rigid: true,
  castShadow: true,
});
engine.start();