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
  // engine.assets.addModel("character", "models/exo_gray.fbx", { scale: 0.03 });
  // engine.assets.addAnimation("character@idle", "models/exo_gray@idle.fbx");

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

  // TODO: make texture look nice here
  // Moving block
  engine.creator.box({
    size: { x: 5, y: 5, z: 5 },
    pos: { x: 0, y: -1, z: 29.5 },
    mass: 0,
    material: new MeshPhongMaterial({
      map: engine.assets.getTexture("floor"),
      bumpMap: engine.assets.getTexture("floor@bump"),
    }),
    friction: 0.9,
    rigid: true,
    receiveShadow: true,
  });

  // Ground Target
  engine.creator.box({
    size: { x: 50, y: 1, z: 50 },
    pos: { x: 0, y: 1, z: 127.5 },
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
    pos: { x: 0, y: 10, z: 0 },
    mass: 0.5,
    restitution: 0.3,
    friction: 0.9,
    material: new MeshPhongMaterial({ color: 0xffcc00 }),
    rigid: true,
    castShadow: true,
  }).withKeyboardMotion()
    .withThirdPersonCamera();

  engine.start();
}

main();