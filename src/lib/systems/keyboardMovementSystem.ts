import { Query, Entity, IterativeSystem } from 'tick-knock';
import { Quaternion, Vector3 } from "three";
import Body from "../components/body";
import KeyboardMotion from "../components/keyboardMotion";
import PhysicsSystem from './physicsSystem';

export default class KeyboardMovementSystem extends IterativeSystem {
  private wasFalling = false;
  private isAirborne: boolean = false;

  constructor() {
    super(new Query(entity => entity.hasAll(KeyboardMotion, Body)));
  }

  protected updateEntity(entity: Entity): void {
    const keyboardInput = entity.get(KeyboardMotion)!;
    const body = entity.get(Body)!;

    const input = {
      forward: keyboardInput.value.input.w,
      backward: keyboardInput.value.input.s,
      left: keyboardInput.value.input.a,
      right: keyboardInput.value.input.d,
      jump: keyboardInput.value.input.space,
      moved: keyboardInput.value.input.w ||
        keyboardInput.value.input.s ||
        keyboardInput.value.input.a ||
        keyboardInput.value.input.d,
    }
    const { speed, rotation } = keyboardInput;

    const bodyPosition = body.position
    const bodyQuaternion = body.quaternion;

    const isFalling = bodyPosition.y < body.prevY;
    if (isFalling) {
      this.isAirborne = true;
    }
    if (!isFalling && this.wasFalling) {
      this.isAirborne = false;
    }
    this.wasFalling = isFalling;

    const velocity = new Vector3();
    const quaternion = new Quaternion();

    if (input.forward) {
      velocity.add(new Vector3(speed, 0, 0));
    }

    if (input.backward) {
      velocity.add(new Vector3(-speed, 0, 0));
    }

    if (input.left) {
      quaternion.multiply(new Quaternion().setFromAxisAngle(
        new Vector3(0, 1, 0), 
        Math.PI / 4 * rotation,
      ));
    }

    if (input.right) {
      quaternion.multiply(new Quaternion().setFromAxisAngle(
        new Vector3(0, 1, 0),
        -Math.PI / 4 * rotation,
      ));
    }

    velocity.applyQuaternion(bodyQuaternion);

    const physicsSystem = this.engine.getSystem(PhysicsSystem)!;
    if (input.jump && !this.isAirborne) {
      this.isAirborne = true;
      physicsSystem.applyForce(body.body, 0, 10, 0);
    }

    if (input.moved && !input.jump && !this.isAirborne) {
      physicsSystem.moveBody(body.body, velocity.x, velocity.y, velocity.z);
    }

    physicsSystem.rotateBody(body.body, quaternion.x, quaternion.y, quaternion.z);

    body.prevY = body.position.y;
  }
}