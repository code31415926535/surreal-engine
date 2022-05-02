import '../../src/style.css';
import { Engine, Vector3 } from "../../src/lib/surreal-engine";

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
    pos: new Vector3(-12.5, 10, -12.5),
    target: new Vector3(0, 0, 0),
    castShadow: true,
    shadowAreaHeight: 20,
    shadowAreaWidth: 20,
  });
  engine.creator.ambientLight({ color: '#ffffff', intensity: 0.5 });

  // Ground
  engine.creator.box({
    size: new Vector3(50, 1, 50),
    mass: 0,
    restitution: 0.3,
    material: 'e',
    rigid: true,
    receiveShadow: true,
  });

  engine.creator.box({
    size: new Vector3(5, 5, 5),
    pos: new Vector3(0, -1, 29.5),
    mass: 0,
    material: 'floor@single',
    friction: 0.9,
    rigid: true,
    receiveShadow: true,
  });

  // Ground Target
  engine.creator.box({
    size: new Vector3(50, 1, 50),
    pos: new Vector3(0, 1, 127.5),
    mass: 0,
    restitution: 0.3,
    material: 'floor@square',
    rigid: true,
    receiveShadow: true,
  });

  // Character
  engine.creator.box({
    size: new Vector3(1, 1, 1),
    pos: new Vector3(0, 10, 0),
    mass: 0.5,
    restitution: 0.3,
    friction: 0.9,
    material: 'yellow',
    rigid: true,
    castShadow: true,
  }).withKeyboardMotion()
    .withThirdPersonCamera();

  engine.start();
}

main();