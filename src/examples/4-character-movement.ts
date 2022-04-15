import Engine from "../lib/engine";
import { MeshPhongMaterial } from 'three';

const engine = new Engine('#demo', {
  debug: true,
});
await engine.init();

engine.creator.box({
  size: { x: 25, y: 1, z: 25 },
  mass: 0,
  restitution: 0.3,
  material: new MeshPhongMaterial({ color: 0xcc0000 }),
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
}).withKeyboardMotion();

engine.creator.directionalLight({
  color: '0xffffff',
  intensity: 1,
  pos: { x: -12.5, y: 10, z: -12.5 },
  target: { x: 0, y: 0, z: 0 },
  castShadow: true,
  shadowAreaHeight: 20,
  shadowAreaWidth: 20,
});

engine.start();