import '../../src/style.css';
import { BasicDebug, Engine, InfoWidget, Vector3 } from "../../src/lib/surreal-engine";

async function main() {
  const engine = new Engine('#demo', {
    debug: BasicDebug,
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
    size: new Vector3(25, 1, 25),
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
    restitution: 0.3,
    material: 'yellow',
    rigid: true,
    castShadow: true,
  }).withKeyboardMotion();

  engine.materials.addPlainMaterial('box', { color: '#333333' });
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      engine.creator.box({
        pos: new Vector3(j, i, -3),
        size: new Vector3(1, 1, 1),
        mass: 0.2,
        restitution: 0.1,
        rigid: true,
        castShadow: true,
        material: 'box',
      });
    }
  }

  engine.creator.sphere({
    radius: 1,
    pos: new Vector3(4, 15, 5),
    mass: 0.2,
    restitution: 0.6,
    friction: 0.5,
    rigid: true,
    castShadow: true,
    material: 'box',
    linearDamping: 0.2,
    angularDamping: 0.2,
  });

  engine.creator.directionalLight({
    color: '0xffffff',
    intensity: 1,
    pos: new Vector3(-12.5, 10, -12.5),
    target: new Vector3(0, 0, 0),
    castShadow: true,
    shadowAreaHeight: 20,
    shadowAreaWidth: 20,
  });

  engine.start();
}

main();