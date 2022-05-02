import '../../src/style.css';
import { Engine, InfoWidget, Vector3 } from "../../src/lib/surreal-engine";

async function main() {
  const engine = new Engine('#demo');
  await engine.init();
  // engine.setOrthographicCamera({
  //   distance: 15,
  // });
  engine.setPerspectiveCamera({
    fov: 60,
    position: new Vector3(10, 10, 10),
  });

  engine.setBackground({
    color: "#252525",
  });
  engine.creator.widget(InfoWidget({
    title: '5 - Camera',
    text: 'This example shows how to configure a simple follow camera.',
  }));

  const size = 12;
  for (let i = 0; i < 10; i++) {
    engine.creator.box({
      pos: new Vector3(-10 - size / 2 - i * (size + 3), i + 2, 0),
      size: new Vector3(size, 1, size),
      mass: 0,
      restitution: 0.3,
      material: 'red',
      rigid: true,
      receiveShadow: true,
    });
  }

  engine.creator.box({
    size: new Vector3(50, 1, 50),
    pos: new Vector3(-10 - size / 2 - 10 * (size + 3), -100, 0),
    mass: 0,
    restitution: 0.9,
    material: 'blue',
    rigid: true,
    receiveShadow: true,
  });

  engine.creator.box({
    size: new Vector3(20, 1, 80),
    mass: 0,
    restitution: 0.3,
    material: 'red',
    rigid: true,
    receiveShadow: true,
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

  engine.creator.sphere({
    radius: 1,
    pos: new Vector3(5, 10, 5),
    mass: 0.5,
    restitution: 0.3,
    material: 'blue',
    rigid: true,
    castShadow: true,
  });

  engine.creator.directionalLight({
    color: '#ffffff',
    intensity: 1,
    pos: new Vector3(-12.5, 10, -12.5),
    target: new Vector3(0, 0, 0),
    castShadow: true,
    shadowAreaHeight: 20,
    shadowAreaWidth: 20,
  });

  engine.creator.ambientLight({
    color: '#ffffff',
    intensity: 0.25,
  });

  engine.start();
}

main();