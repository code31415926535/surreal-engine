import '../../src/style.css';
import Engine from "../../src/lib/engine";

// TODO: Complete example
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
  engine.assets.addModel("character", "models/exo_gray.fbx", { scale: 0.03 });
  engine.assets.addAnimation("character@idle", "models/exo_gray@idle.fbx");

  await engine.assets.load((progress) => {
    console.log(`Loading: ${progress * 100}%`);
  });

  engine.setBackground({
    skybox: engine.assets.getTexture("skybox"),
  });
  engine.materials.addTexturedMaterial("floor", { texture: "floor" });

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
    material: engine.materials.getMaterial("floor"),
    rigid: true,
    receiveShadow: true,
  });

  engine.assets.getModel("character").position.set(0, 0.5, 0);

  // TODO: Add cretor function for entity with model
  // TODO: Model has to support changing position, rotation and scale
  // TODO: Model has to support collision detection
  engine.creator.empty().withObject3D({
    obj: engine.assets.getModel("character"),
  }).withRigidBody({
    size: { x: 0.5, y: 0.5, z: 0.5 },
    type: 'box',
    mass: 1,
    restitution: 0.3,
    friction: 0.5,
  });

  engine.start();
}

main();