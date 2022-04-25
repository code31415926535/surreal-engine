import '../../src/style.css';
import Engine from "../../src/lib/engine";

async function main() {
  const engine = new Engine('#demo', { debug: true });
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
  engine.assets.addModel("knight_statue", "models/knight_statue.glb", { scale: 2 });
  engine.assets.addModel("character", "models/exo_gray.fbx", { scale: 0.03 });
  engine.assets.addAnimation("character@idle", "models/exo_gray@idle.fbx");

  await engine.assets.load((progress) => {
    console.log(`Loading: ${progress * 100}%`);
  });

  engine.setBackground({
    skybox: engine.assets.getTexture("skybox"),
  });
  engine.materials.addTexturedMaterial("floor@square", { texture: "floor", repeat: { x: 5, y: 5 } });
  engine.materials.addTexturedMaterial("floor@row", { texture: "floor", repeat: { x: 1, y: 5 } });

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
    pos: { x: 0, y: 0, z: 50 },
    size: { x: 10, y: 1, z: 50 },
    mass: 0,
    restitution: 0.3,
    material: engine.materials.getMaterial("floor@row"),
    rigid: true,
    receiveShadow: true,
  });

  engine.creator.model({
    model: "knight_statue",
    size: { x: 1, y: 1, z: 1 },
    pos: { x: 10, y: 0.5, z: 11 },
  });
  engine.creator.model({
    model: "knight_statue",
    size: { x: 1.2, y: 1.5, z: 1 },
    pos: { x: -10, y: 0.5, z: 11 },
  });

  // TODO: This does not work if copied
  // TODO: Model has to support collision box
  engine.creator.empty().withObject3D({
    obj: engine.assets.getModel("character"),
  }).withThirdPersonCamera().withKeyboardMotion();

  engine.start();
}

main();