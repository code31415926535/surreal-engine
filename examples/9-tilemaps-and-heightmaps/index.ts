import '../../src/style.css';
import {
  Euler,
  quickStart, Vector2, Vector3,
} from "../../src/lib/surreal-engine";
// TODO: Proper import here
import { BumpHeightmapGenerator, Heightmap } from '../../src/lib/modules/heightmap';

quickStart(
  '#demo', 
  { showFps: true, debug: { orbitControls: true } },
  (assets) => {
    assets.setBasePath("/assets/");
    assets.addTexture("floor", "textures/floor.png");
    assets.addTexture("floor@bump", "textures/floor_bump.png");
},
(engine) => {
  engine.materials.addTexturedMaterial("floor", { texture: "floor", repeat: { x: 5, y: 5 } });

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
  engine.creator.plane({
    pos: new Vector3(0, 0, 0),
    rot: new Euler(0, 0, 0),
    size: new Vector2(100, 100),
    segments: new Vector2(100, 100),
    material: 'floor',
    rigid: true,
    receiveShadow: true,
    heightmap: new Heightmap(100, 100, 10, new BumpHeightmapGenerator(
      new Vector2(50, 50),
      50,
    )),
  });

  engine.creator.box({
    size: new Vector3(1, 1, 1),
    pos: new Vector3(0, 10, 0),
    mass: 0.5,
    restitution: 0.1,
    material: 'yellow',
    rigid: true,
    castShadow: true,
  }).withKeyboardMotion({
    speed: 2,
    rotation: 1.5,
  }).withOffsetCamera();
});
