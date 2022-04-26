import '../../src/style.css';
import Engine, { InfoWidget } from "../../src/lib";

async function main() {
  const engine = new Engine('#demo', {
    debug: true,
  });
  await engine.init();

  engine.setBackground({
    color: "#252525",
    fog: {
      color: "#000000",
      density: 0.08,
    }
  });

  engine.creator.widget(new InfoWidget({
    title: '2 - Lighting & Shadows & Fog',
    text: 'This example shows how to use lighting, shadows and fog.',
  }));

  engine.creator.pointLight({
    color: '#ffffff',
    intensity: 0.6,
    pos: { x: 0, y: 5, z: 0 },
  });

  engine.creator.directionalLight({
    color: '#ffffff',
    intensity: 1,
    pos: { x: -10, y: 10, z: 10 },
    target: { x: 0, y: 0, z: 0 },
    castShadow: true,
    shadowAreaHeight: 10,
    shadowAreaWidth: 10,
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
}

main();