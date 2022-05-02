import '../../src/style.css';
import { Engine, InfoWidget, Vector3 } from "../../src/lib/surreal-engine";

async function main() {
  const engine = new Engine('#demo', {
    showFps: true,
  });
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
    material: 'floor',
    rigid: true,
    receiveShadow: true,
  });

  // Character
  engine.creator.box({
    size: new Vector3(1, 1, 1),
    pos: new Vector3(10, 10, 10),
    mass: 0.5,
    restitution: 0.3,
    material: 'yellow',
    rigid: true,
    castShadow: true,
  }).withKeyboardMotion().withOffsetCamera();

  // Some Boxes
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        engine.creator.box({
          pos: new Vector3(j, i, k),
          size: new Vector3(1, 1, 1),
          mass: 0.2,
          restitution: 0.1,
          rigid: true,
          castShadow: true,
          material: 'box',
        });
      }
    }
  }

  engine.start();
}

main();