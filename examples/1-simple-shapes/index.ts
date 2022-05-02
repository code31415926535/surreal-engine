import '../../src/style.css';
import { BasicDebug, Engine, InfoWidget, Vector3 } from "../../src/lib/surreal-engine";

async function main() {
  const engine = new Engine('#demo', {
    debug: BasicDebug,
  });
  await engine.init();

  engine.creator.widget(InfoWidget({
    title: '1 - Simple Shapes',
    text: 'This is a simple example of how to create simple shapes.',
  }));

  engine.creator.ambientLight({
    color: '#ffffff',
    intensity: 0.5,
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
};

main();