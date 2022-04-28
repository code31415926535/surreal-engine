# Platformer

In this tutorial, we will make a simple platformer game. The game will include a
nice character model, movement, a third person camera, and, of course, some obstacles!
Let's dive into it.

## Setting up the scene

Let's start by adding the quickStart boilerplate with a [skybox](../examples/6-textures-and-skybox/index.ts) and some lighting:

```ts
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
```
