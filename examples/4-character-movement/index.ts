import '../../src/style.css';
import Engine from "../../src/lib";
import { MeshPhongMaterial } from 'three';

async function main() {
  const engine = new Engine('#demo', {
    debug: true,
  });
  await engine.init();

  engine.setBackground({
    color: "#252525",
  });

  engine.creator.box({
    size: { x: 25, y: 1, z: 25 },
    mass: 0,
    restitution: 0.3,
    material: new MeshPhongMaterial({ color: 0xcc0000 }),
    rigid: true,
    receiveShadow: true,
  });

  engine.creator.box({
    size: { x: 1, y: 1, z: 1 },
    pos: { x: 0, y: 10, z: 0 },
    mass: 0.5,
    restitution: 0.3,
    material: new MeshPhongMaterial({ color: 0xffcc00 }),
    rigid: true,
    castShadow: true,
  }).withKeyboardMotion();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      engine.creator.box({
        pos: { x: j, y: i, z: -3 },
        size: { x: 1, y: 1, z: 1 },
        mass: 0.2,
        restitution: 0.1,
        rigid: true,
        castShadow: true,
        material: new MeshPhongMaterial({ color: 0x333333 }),
      });
    }
  }

  engine.creator.sphere({
    radius: 1,
    pos: { x: 4, y: 15, z: 5 },
    mass: 0.2,
    restitution: 0.6,
    friction: 0.5,
    rigid: true,
    castShadow: true,
    material: new MeshPhongMaterial({ color: 0x333333 }),
    linearDamping: 0.2,
    angularDamping: 0.2,
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

  engine.start();
}

main();