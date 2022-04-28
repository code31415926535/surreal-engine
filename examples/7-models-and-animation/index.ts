import '../../src/style.css';
import { MotionDebug, quickStart } from "../../src/lib/surreal-engine";

async function main() {
  quickStart(
    '#demo', 
    { showFps: true, debug: MotionDebug },
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
      assets.addModel("character", "models/test-char.glb");
      // assets.addModel("datsun", "models/free_datsun_280z/scene.gltf");
  },
  (engine) => {
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
    engine.creator.box({
      pos: { x: 0, y: 0, z: 100 },
      size: { x: 50, y: 1, z: 50 },
      mass: 0,
      restitution: 0.3,
      material: engine.materials.getMaterial("floor@square"),
      rigid: true,
      receiveShadow: true,
    })
  
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

    // TODO: Very very slow
    // engine.creator.model({
    //   model: "datsun",
    //   size: { x: 3, y: 3, z: 3 },
    //   pos: { x: 0, y: 1, z: 90 },
    // });

    // TODO: Model has to support collision box
    engine.creator.model({
      model: "character",
      size: { x: 2, y: 2, z: 2 },
      pos: { x: 0, y: 0.5, z: 0.5 },
    })
      .withThirdPersonCamera()
      .withKeyboardMotion()
      .withAnimation({
        initial: "idle",
        clips: [{
          name: "idle",
          clip: "character@Armature|mixamo.com|Layer0",
        }]      
      });
    console.log(engine.assets.animationsFor("character"));
  });
}

main();