import '../../src/style.css';
import Engine, { InfoWidget } from "../../src/lib";

async function main() {
  const engine = new Engine('#demo');
  await engine.init();
  engine.creator.widget(InfoWidget({
    title: '6 - Textures and Skybox',
    text: 'This example shows how to use textures and skybox. Skybox is a cube map that can be used to simulate the sky.',
  }));

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
  engine.assets.addTexture("box@normal", "textures/metal/metalbox_normal.png");
  engine.assets.addTexture("box@bump", "textures/metal/metalbox_bump.png");
  engine.assets.addTexture("box@ao", "textures/metal/metalbox_AO.png");
  engine.assets.addTexture("box@diffuse", "textures/metal/metalbox_diffuse.png");
  await engine.assets.load();

  engine.setBackground({
    skybox: engine.assets.getTexture("skybox"),
  });
  engine.materials.addTexturedMaterial("floor", { texture: "floor", repeat: { x: 5, y: 5 } });
  engine.materials.addTexturedMaterial("box", {
    texture: {
      map: "box@diffuse",
      normalMap: "box@normal",
      aoMap: "box@ao",
      bumpMap: "box@bump",
    },
    shininess: 50,
    reflectivity: 0.8,
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
    material: engine.materials.getMaterial("floor"),
    rigid: true,
    receiveShadow: true,
  });

  // Character
  engine.creator.box({
    size: { x: 1, y: 1, z: 1 },
    pos: { x: 10, y: 10, z: 10 },
    mass: 0.5,
    restitution: 0.3,
    material: engine.materials.getMaterial('yellow'),
    rigid: true,
    castShadow: true,
  }).withKeyboardMotion().withOffsetCamera();

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
          material: engine.materials.getMaterial('box'),
        });
      }
    }
  }

  engine.start();
}

main();