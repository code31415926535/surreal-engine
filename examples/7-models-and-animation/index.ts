import '../../src/style.css';
import { quickStart, Euler, Vector3, CrossFadeTransition } from "../../src/lib/surreal-engine";

async function main() {
  quickStart(
    '#demo', 
    { showFps: true },
    (assets) => {
      assets.setBasePath("/assets/");
      assets.addTexture("floor", "textures/floor.png");
      assets.addTexture("floor@bump", "textures/floor_bump.png");
      assets.addCubeTexture("skybox", [
        "textures/vz_techno_back.png",
        "textures/vz_techno_down.png",
        "textures/vz_techno_front.png",
        "textures/vz_techno_left.png",
        "textures/vz_techno_right.png",
        "textures/vz_techno_up.png",
      ]);
      assets.addModel("knight_statue", "models/knight_statue.glb");
      assets.addModel("hero", "models/hero.glb");
      assets.addModel("datsun", "models/free_datsun_280z/scene.gltf");
  },
  (engine) => {
    engine.setBackground({
      skybox: engine.assets.getTexture("skybox"),
    });
    engine.materials.addTexturedMaterial("floor@square", { texture: "floor", repeat: { x: 5, y: 5 } });
    engine.materials.addTexturedMaterial("floor@row", { texture: "floor", repeat: { x: 1, y: 5 } });

    engine.assets.clipAnimation("hero@All", "hero@idle", 0, 301);
    engine.assets.clipAnimation("hero@All", "hero@run", 302, 321);
    engine.assets.clipAnimation("hero@All", "hero@idle2", 323, 443);
    engine.assets.clipAnimation("hero@All", "hero@jump", 445, 450);
    engine.assets.clipAnimation("hero@All", "hero@land", 454, 486);
    engine.assets.clipAnimation("hero@All", "hero@air", 488, 509);

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
      material: 'floor@square',
      rigid: true,
      receiveShadow: true,
    });
    engine.creator.box({
      pos: new Vector3(0, 0, 50),
      size: new Vector3(10, 1, 50),
      mass: 0,
      restitution: 0.3,
      material: 'floor@row',
      rigid: true,
      receiveShadow: true,
    });
    engine.creator.box({
      pos: new Vector3(0, 0, 100),
      size: new Vector3(50, 1, 50),
      mass: 0,
      restitution: 0.3,
      material: 'floor@square',
      rigid: true,
      receiveShadow: true,
    })
  
    engine.creator.model({
      model: "knight_statue",
      size: new Vector3(1, 1, 1),
      pos: new Vector3(10, 0.5, 11),
      castShadow: true,
    });
    engine.creator.model({
      model: "knight_statue",
      size: new Vector3(1.2, 1.5, 1),
      pos: new Vector3(-10, 0.5, 11),
      castShadow: true,
    });

    engine.creator.model({
      model: "hero",
      size: new Vector3(2, 2, 2),
      pos: new Vector3(0, 0, 0),
      offset: {
        rot: new Euler(0, Math.PI / 2, 0),
      },
      castShadow: true,
    })
      .withAnimation({
        initial: "idle",
        states: [{
          name: "idle",
          clip: "hero@idle",
          handler: (action, _, setState) => {
            if (action === 'run') {
              setState('run', CrossFadeTransition(0.5));
            } else if (action === 'jump') {
              setState('jump', CrossFadeTransition(0.2));
            }
          },
        }, {
          name: "run",
          clip: "hero@run",
          handler: (action, _, setState) => {
            if (action === 'idle') {
              setState('idle', CrossFadeTransition(0.5));
            } else if (action === 'jump') {
              setState('jump', CrossFadeTransition(0.3));
            }
          },
        }, {
          name: "jump",
          clip: "hero@air",
          handler: (action, _, setState) => {
            if (action === "land") {
              setState("land", CrossFadeTransition(0.2));
            }
          }
        }, {
          name: "land",
          clip: "hero@land",
          opts: {
            noLoop: true,
          },
          handler: (action, _, setState) => {
            if (action === "finished") {
              setState("idle", CrossFadeTransition(0.2));
            }
          }
        }],
      })
      .withBoundingBox()
      .withKeyboardMotion({ speed: 3, jump: 5 })
      .withThirdPersonCamera(new Vector3(4, 2, 0), new Vector3(-10, 5, 1));
  });
}

main();