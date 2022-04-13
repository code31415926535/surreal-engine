import Engine from "../lib/engine";
import { CurvePath, LineCurve3, MeshPhongMaterial, Vector3 } from 'three';

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
});

// TODO: Debug this
const curve: CurvePath<Vector3> = new CurvePath();
curve.add(new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, 12.5)));
curve.add(new LineCurve3(new Vector3(0, 0, 12.5), new Vector3(12.5, 0, 12.5)));
curve.add(new LineCurve3(new Vector3(12.5, 0, 12.5), new Vector3(12.5, 0, 0)));
curve.add(new LineCurve3(new Vector3(12.5, 0, 0), new Vector3(0, 0, 0)));

engine.creator.directionalLight({
  color: '0xffffff',
  intensity: 1,
  pos: { x: 10, y: 10, z: 0 },
  target: { x: 0, y: 0, z: 0 },
  castShadow: true,
}).withStaticMotion({
  path: curve,
  duration: 5000,
  loop: false,
});

engine.start();