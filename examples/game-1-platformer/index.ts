import '../../src/style.css';
import { quickStart } from "../../src/lib/surreal-engine";

quickStart(
  "#demo",
  { showFps: true, debug: { orbitControls: true } },
  assets => {
    assets.addCubeTexture("skybox", [
      "textures/vz_techno_back.png",
      "textures/vz_techno_down.png",
      "textures/vz_techno_front.png",
      "textures/vz_techno_left.png",
      "textures/vz_techno_right.png",
      "textures/vz_techno_up.png",
    ]);
  },
  engine => {
    engine.setBackground({
      skybox: engine.assets.getTexture("skybox"),
    });
    engine.creator.ambientLight({ color: '#ffffff', intensity: 0.5 });
  }
);