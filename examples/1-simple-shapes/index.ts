import '../../src/style.css';
import Engine, { InfoWidget } from "../../src/lib";

async function main() {
  const engine = new Engine('#demo', {
    debug: true,
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
    size: { x: 25, y: 1, z: 25 },
    mass: 0,
    restitution: 0.3,
    material: engine.materials.getMaterial('white'),
    rigid: true,
    receiveShadow: true,
  });

  engine.creator.box({
    size: { x: 1, y: 1, z: 1 },
    pos: { x: 0, y: 10, z: 0 },
    mass: 0.5,
    restitution: 0.3,
    material: engine.materials.getMaterial('magenta'),
    rigid: true,
    castShadow: true,
  });

  engine.creator.box({
    size: { x: 1, y: 1, z: 1 },
    pos: {x: 0.5, y: 15, z: 0},
    mass: 1,
    restitution: 0.3,
    material: engine.materials.getMaterial('yellow'),
    rigid: true,
    castShadow: true,
  });

  engine.creator.sphere({
    radius: 1,
    pos: {x: 0, y: 20, z: 0},
    mass: 1,
    restitution: 0.3,
    material: engine.materials.getMaterial('blue'),
    rigid: true,
    castShadow: true,
  });

  engine.start();
};

main();