import Engine from "../lib/engine";
import { MeshPhongMaterial } from 'three';

const engine = new Engine('#demo');
await engine.init();
// engine.setOrthographicCamera({
//   distance: 15,
// });
engine.setPerspectiveCamera({
  fov: 60,
  position: { x: 10, y: 10, z: 10 },
});

for (let i = 0; i < 10; i++) {
  engine.creator.box({
    pos: { x: -16 - i * (6 + i), y: i + 2, z: -i * 4 },
    size: { x: 4, y: 1, z: 4 },
    mass: 0,
    restitution: 0.3,
    material: new MeshPhongMaterial({ color: 0xcc0000 }),
    rigid: true,
    receiveShadow: true,
  });
}

engine.creator.box({
  size: { x: 20, y: 1, z: 20 },
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
}).withKeyboardInput().withFollowCamera();

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