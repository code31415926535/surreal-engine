import '../../src/style.css';
import { BasicDebug, Engine, InfoWidget, Vector3 } from "../../src/lib/surreal-engine";

async function main() {
  const engine = new Engine('#demo', {
    debug: BasicDebug,
  });
  await engine.init();

  engine.setBackground({
    color: "#252525",
    fog: {
      color: "#000000",
      density: 0.08,
    }
  });

  engine.creator.widget(InfoWidget({
    title: '2 - Lighting & Shadows & Fog',
    text: 'This example shows how to use lighting, shadows and fog.',
  }));

  engine.creator.pointLight({
    color: '#ffffff',
    intensity: 0.6,
    pos: new Vector3(0, 5, 0),
  });

  engine.creator.directionalLight({
    color: '#ffffff',
    intensity: 1,
    pos: new Vector3(-10, 10, 10),
    target: new Vector3(0, 0, 0),
    castShadow: true,
    shadowAreaHeight: 10,
    shadowAreaWidth: 10,
  });

  engine.creator.box({
    size: new Vector3(25, 1, 25),
    mass: 0,
    restitution: 0.3,
    material: 'white',
    rigid: true,
    receiveShadow: true,
  });

  engine.creator.box({
    size: new Vector3(1, 1, 1),
    pos: new Vector3(0, 10, 0),
    mass: 0.5,
    restitution: 0.3,
    material: 'magenta',
    rigid: true,
    castShadow: true,
  });

  engine.creator.box({
    size: new Vector3(1, 1, 1),
    pos: new Vector3(0.5, 15, 0),
    mass: 1,
    restitution: 0.3,
    material: 'yellow',
    rigid: true,
    castShadow: true,
  });

  engine.creator.sphere({
    radius: 1,
    pos: new Vector3(0, 20, 0),
    mass: 1,
    restitution: 0.3,
    material: 'blue',
    rigid: true,
    castShadow: true,
  });

  engine.start();
}

main();