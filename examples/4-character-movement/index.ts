import '../../src/style.css';
import Engine, { InfoWidget } from "../../src/lib";

async function main() {
  const engine = new Engine('#demo', {
    debug: true,
  });
  await engine.init();

  engine.setBackground({
    color: "#252525",
  });
  engine.creator.widget(InfoWidget({
    title: '4 - Character Movement',
    text: 'This examples shows how to use character movement. Press the w, a, s, d keys to move the character. Press the spacebar to jump.',
  }));

  engine.creator.box({
    size: { x: 25, y: 1, z: 25 },
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
    restitution: 0.3,
    material: engine.materials.getMaterial('yellow'),
    rigid: true,
    castShadow: true,
  }).withKeyboardMotion();

  engine.materials.addPlainMaterial('box', { color: '#333333' });
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      engine.creator.box({
        pos: { x: j, y: i, z: -3 },
        size: { x: 1, y: 1, z: 1 },
        mass: 0.2,
        restitution: 0.1,
        rigid: true,
        castShadow: true,
        material: engine.materials.getMaterial('box'),
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
    material: engine.materials.getMaterial('box'),
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