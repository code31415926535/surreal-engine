import '../../src/style.css';
import Engine from "../../src/lib/engine";
import { MeshPhongMaterial } from 'three';

async function main() {
  const engine = new Engine('#demo');
  await engine.init();

  engine.assets.setBasePath("/assets/");
  engine.assets.addTexture("floor", "textures/floor.png", { repeat: { x: 5, y: 5 } });
  engine.assets.addTexture("floor@bump", "textures/floor_bump.png", { repeat: { x: 5, y: 5 } });
  engine.assets.addCubeTexture("skybox", [
    "textures/vz_techno_back.png",
    "textures/vz_techno_down.png",
    "textures/vz_techno_front.png",
    "textures/vz_techno_left.png",
    "textures/vz_techno_right.png",
    "textures/vz_techno_up.png",
  ]);
  engine.assets.addTexture("box@normal", "textures/metal/metalbox_normal.png");
  engine.assets.addTexture("box@bump", "textures/metal/metalbox_bump.png");
  engine.assets.addTexture("box@ao", "textures/metal/metalbox_AO.png");
  engine.assets.addTexture("box@diffuse", "textures/metal/metalbox_diffuse.png");
  await engine.assets.load((progress) => {
    console.log(`Loading: ${progress * 100}%`);
  });

  engine.setBackground({
    skybox: engine.assets.getTexture("skybox"),
  });

  // Lighting
  engine.creator.directionalLight({
    color: '#ffffff',
    intensity: 1,
    pos: { x: -12.5, y: 10, z: -12.5 },
    target: { x: 0, y: 0, z: 0 },
    castShadow: true,
    shadowAreaHeight: 20,
    shadowAreaWidth: 20,
  });
  engine.creator.ambientLight({ color: '#ffffff', intensity: 0.5 });

  // Ground
  engine.creator.box({
    size: { x: 50, y: 1, z: 50 },
    mass: 0,
    restitution: 0.3,
    material: new MeshPhongMaterial({
      map: engine.assets.getTexture("floor"),
      bumpMap: engine.assets.getTexture("floor@bump"),
    }),
    rigid: true,
    receiveShadow: true,
  });

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

  const material = new MeshPhongMaterial({
    map: engine.assets.getTexture("box@diffuse"),
    normalMap: engine.assets.getTexture("box@normal"),
    bumpMap: engine.assets.getTexture("box@bump"),
    aoMap: engine.assets.getTexture("box@ao"),
    shininess: 50,
    reflectivity: 0.8,
  });

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
          material,
        });
      }
    }
  }

  engine.start();
}

main();