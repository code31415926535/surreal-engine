import '../../src/style.css';
import { BasicDebug, Engine, InfoWidget } from "../../src/lib/surreal-engine";
import { CurvePath, LineCurve3, Vector3 } from 'three';

async function main() {
  const engine = new Engine('#demo', {
    debug: BasicDebug,
  });
  await engine.init();

  engine.setBackground({
    color: "#252525",
  });

  engine.creator.widget(InfoWidget({
    title: '3 - Motion',
    text: 'This feature is still work in progress and is subject to change.',
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
  });

  const curve: CurvePath<Vector3> = new CurvePath();
  curve.add(new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, 25)));
  curve.add(new LineCurve3(new Vector3(0, 0, 25), new Vector3(25, 0, 25)));
  curve.add(new LineCurve3(new Vector3(25, 0, 25), new Vector3(25, 0, 0)));
  curve.add(new LineCurve3(new Vector3(25, 0, 0), new Vector3(0, 0, 0)));

  engine.creator.directionalLight({
    color: '#ffffff',
    intensity: 1,
    pos: new Vector3(-12.5, 10, -12.5),
    target: new Vector3(0, 0, 0),
    castShadow: true,
  }).withStaticMotion({
    path: curve,
    duration: 5000,
  });

  engine.start();
}

main();