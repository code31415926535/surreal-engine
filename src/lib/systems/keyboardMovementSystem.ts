import { Entity, Query } from 'tick-knock';
import { Quaternion, Vector3 } from "three";
import Body from "../components/body";
import KeyboardMotion from "../components/keyboardMotion";
import PhysicsSystem from './physicsSystem';
import SingleEntitySystem from './singleEntitySystem';
import { KeyboardStateChangeEvent } from './keyboardInputSystem';

export default class KeyboardMovementSystem extends SingleEntitySystem {
  private wasFalling = false;
  private isAirborne: boolean = false;
  private input: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    moved: boolean;
  };

  constructor() {
    super(new Query(entity => entity.hasAll(KeyboardMotion, Body)));
    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
      moved: false,
    }
  }

  protected init() {
    this.engine.subscribe(KeyboardStateChangeEvent, this.onKeyboardEvent.bind(this));
  }

  protected onKeyboardEvent(state: KeyboardStateChangeEvent): void {
    this.input = {
      forward: state.keys.w,
      backward: state.keys.s,
      left: state.keys.a,
      right: state.keys.d,
      jump: state.keys[' '],
      moved: state.keys.w || state.keys.s || state.keys.a || state.keys.d,
    }
  }

  protected updateEntity(entity: Entity): void {
    const keyboardInput = entity.get(KeyboardMotion)!;
    const body = entity.get(Body)!;

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

    if (this.input.forward) {
      velocity.add(new Vector3(speed, 0, 0));
    }

    if (this.input.backward) {
      velocity.add(new Vector3(-speed, 0, 0));
    }

    if (this.input.left) {
      quaternion.multiply(new Quaternion().setFromAxisAngle(
        new Vector3(0, 1, 0), 
        Math.PI / 4 * rotation,
      ));
    }

    if (this.input.right) {
      quaternion.multiply(new Quaternion().setFromAxisAngle(
        new Vector3(0, 1, 0),
        -Math.PI / 4 * rotation,
      ));
    }

    velocity.applyQuaternion(bodyQuaternion);

    const physicsSystem = this.engine.getSystem(PhysicsSystem)!;
    if (this.input.jump && !this.isAirborne) {
      this.isAirborne = true;
      physicsSystem.applyForce(body.body, 0, 10, 0);
    }

    if (this.input.moved && !this.input.jump && !this.isAirborne) {
      physicsSystem.moveBody(body.body, velocity.x, velocity.y, velocity.z);
    }

    physicsSystem.rotateBody(body.body, quaternion.x, quaternion.y, quaternion.z);

    body.prevY = body.position.y;
  }
}