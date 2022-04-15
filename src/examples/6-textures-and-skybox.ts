import Engine from "../lib/engine";
import { MeshPhongMaterial } from 'three';

const engine = new Engine('#demo');
await engine.init();

engine.assets.setBasePath("src/examples/");
engine.assets.addTexture("floor", "textures/floor.png", { repeat: { x: 5, y: 5 } });
await engine.assets.load((progress) => {
  console.log(`Loading: ${progress * 100}%`);
});

// Lighting
engine.creator.directionalLight({
  color: '0xffffff',
  intensity: 1,
  pos: { x: -12.5, y: 10, z: -12.5 },
  target: { x: 0, y: 0, z: 0 },
  castShadow: true,
  shadowAreaHeight: 20,
  shadowAreaWidth: 20,
});
engine.creator.ambientLight({ color: '0xffffff', intensity: 0.5 });

// Ground
engine.creator.box({
  size: { x: 50, y: 1, z: 50 },
  mass: 0,
  restitution: 0.3,
  material: new MeshPhongMaterial({
    map: engine.assets.getTexture("floor"),
  }),
  rigid: true,
  receiveShadow: true,
});
// TODO: Wall

// TODO: Skin this
// Character
engine.creator.box({
  size: { x: 1, y: 1, z: 1 },
  pos: { x: 10, y: 10, z: 10 },
  mass: 0.5,
  restitution: 0.3,
  material: new MeshPhongMaterial({ color: 0xffcc00 }),
  rigid: true,
  castShadow: true,
}).withKeyboardMotion().withFollowCamera();

// Some Boxes
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 3; k++) {
      engine.creator.box({
        pos: { x: j, y: i, z: k },
        size: { x: 1, y: 1, z: 1 },
        mass: 0.2,
        restitution: 0.1,
        rigid: true,
        castShadow: true,
        material: new MeshPhongMaterial({ color: 0x333333 }),
      });
    }
  }
}

engine.start();