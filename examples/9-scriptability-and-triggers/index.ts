import '../../src/style.css';
import { Engine } from "../../src/lib/surreal-engine";

// TODO: Complete example
async function main() {
  const engine = new Engine('#demo');
  await engine.init();

  engine.assets.setBasePath("/assets/");
  engine.assets.addTexture("floor", "textures/floor.png");
  engine.assets.addTexture("floor@bump", "textures/floor_bump.png");
  engine.assets.addCubeTexture("skybox", [
    "textures/vz_techno_back.png",
    "textures/vz_techno_down.png",
    "textures/vz_techno_front.png",
    "textures/vz_techno_left.png",
    "textures/vz_techno_right.png",
    "textures/vz_techno_up.png",
  ]);

  await engine.assets.load();
  engine.materials.addTexturedMaterial("floor@square", { texture: "floor", repeat: { x: 5, y: 5 } });
  engine.materials.addTexturedMaterial("floor@single", { texture: "floor", repeat: { x: 1, y: 1 } });

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
    material: engine.materials.getMaterial("floor@square"),
    rigid: true,
    receiveShadow: true,
  });

  engine.creator.box({
    size: { x: 5, y: 5, z: 5 },
    pos: { x: 0, y: -1, z: 29.5 },
    mass: 0,
    material: engine.materials.getMaterial("floor@single"),
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
    material: engine.materials.getMaterial("floor@square"),
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
    material: engine.materials.getMaterial('yellow'),
    rigid: true,
    castShadow: true,
  }).withKeyboardMotion()
    .withThirdPersonCamera();

  engine.start();
}

main();