import '../../src/style.css';
import Engine from "../../src/lib";

async function main() {
  const engine = new Engine('#demo');
  await engine.init();
  // engine.setOrthographicCamera({
  //   distance: 15,
  // });
  engine.setPerspectiveCamera({
    fov: 60,
    position: { x: 10, y: 10, z: 10 },
  });

  engine.setBackground({
    color: "#252525",
  });

  const size = 12;
  for (let i = 0; i < 10; i++) {
    engine.creator.box({
      pos: { x: -10 - size / 2 - i * (size + 3), y: i + 2, z: 0 },
      size: { x: size, y: 1, z: size },
      mass: 0,
      restitution: 0.3,
      material: engine.materials.getMaterial('red'),
      rigid: true,
      receiveShadow: true,
    });
  }

  engine.creator.box({
    size: { x: 50, y: 1, z: 50 },
    pos: { x: -10 - size / 2 - 10 * (size + 3), y: -100, z: 0 },
    mass: 0,
    restitution: 0.9,
    material: engine.materials.getMaterial('blue'),
    rigid: true,
    receiveShadow: true,
  });

  engine.creator.box({
    size: { x: 20, y: 1, z: 80 },
    mass: 0,
    restitution: 0.3,
    material: engine.materials.getMaterial('red'),
    rigid: true,
    receiveShadow: true,
  });

  engine.creator.box({
    size: { x: 1, y: 1, z: 1 },
    pos: { x: 0, y: 10, z: 0 },
    mass: 0.5,
    restitution: 0.1,
    material: engine.materials.getMaterial('yellow'),
    rigid: true,
    castShadow: true,
  }).withKeyboardMotion({
    speed: 2,
    rotation: 1.5,
  }).withOffsetCamera();

  engine.creator.sphere({
    radius: 1,
    pos: { x: 5, y: 10, z: 5 },
    mass: 0.5,
    restitution: 0.3,
    material: engine.materials.getMaterial('blue'),
    rigid: true,
    castShadow: true,
  });

  engine.creator.directionalLight({
    color: '0xffffff',
    intensity: 1,
    pos: { x: -12.5, y: 10, z: -12.5 },
    target: { x: 0, y: 0, z: 0 },
    castShadow: true,
    shadowAreaHeight: 20,
    shadowAreaWidth: 20,
  });

  engine.creator.ambientLight({
    color: '0xffffff',
    intensity: 0.25,
  });

  engine.start();
}

main();