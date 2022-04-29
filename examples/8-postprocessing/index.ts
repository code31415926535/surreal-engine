import '../../src/style.css';
import { quickStart, UnrealBloomPass, GlitchPass } from "../../src/lib/surreal-engine";
import { Euler, Quaternion, Vector2, Vector3 } from 'three';

// TODO: Complete with full movement kit
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
    assets.addModel("character", "models/test-char.glb");
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

  const euler = new Euler(0, Math.PI / 2, 0);
  const q = new Quaternion().setFromEuler(euler);

  engine.creator.model({
    model: "character",
    size: { x: 2, y: 2, z: 2 },
    pos: { x: 0, y: 0, z: 0 },
    offsetQuat: { x: q.x, y: q.y, z: q.z, w: q.w },
    castShadow: true,
  })
    .withAnimation({
      initial: "idle",
      clips: [{
        name: "idle",
        clip: "character@Idle",
      }]      
    })
    .withBoundingBox()
    .withKeyboardMotion()
    .withThirdPersonCamera(new Vector3(4, 2, 0), new Vector3(-10, 5, 1));

  engine.creator.timer(() => {
    engine.creator.box({
      size: { x: 0.5, y: 0.5, z: 0.5 },
      pos: { x: Math.random() * 10, y: 15, z: Math.random() * 10 },
      mass: 0.25,
      // TODO: Cooler material here
      material: engine.materials.getMaterial("black"),
      rigid: true,
      castShadow: true,
    });
  }, 500, true);

  engine.addPostProcessing(new UnrealBloomPass(new Vector2(10, 10), 1.5, 0.4, 0.85));
  engine.addPostProcessing(new GlitchPass());
});