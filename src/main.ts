import './style.css';
import Engine from "./lib/engine";
import { MeshBasicMaterial } from 'three';

const engine = new Engine('#demo');
await engine.init();
engine.creator.box({
  size: { x: 25, y: 1, z: 25 },
  mass: 0,
  restitution: 0.3,
  rigid: true,
}).box({
  size: { x: 1, y: 1, z: 1 },
  pos: { x: 0, y: 10, z: 0 },
  mass: 0.5,
  restitution: 0.3,
  material: new MeshBasicMaterial({ color: 0xffcc00 }),
  rigid: true,
}).box({
  size: { x: 1, y: 1, z: 1 },
  pos: {x: 0.5, y: 15, z: 0},
  mass: 1,
  restitution: 0.3,
  material: new MeshBasicMaterial({ color: 0x00ffcc }),
  rigid: true,
});
engine.start();