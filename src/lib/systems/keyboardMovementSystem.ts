import { Quaternion, Vector3 } from "three";
import Body, { BodySchema } from "../components/body";
import KeyboardMotion, { KeyboardMotionSchema } from "../components/keyboardMotion";
import { getPosition, getQuaternion } from "../entityUtils";
import SurrealSystem from "./surrealSystem";

export default class KeyboardMovementSystem extends SurrealSystem {
  private wasFalling = false;
  private isAirborne: boolean = false;

  execute() {
    for (const entity of this.queries.keyboardInput.results) {
      const keyboardInput = entity.getComponent(KeyboardMotion)! as any as KeyboardMotionSchema;
      const body = entity.getMutableComponent(Body)! as any as BodySchema;

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

      const bodyPosition = getPosition(entity);
      const bodyQuaternion = getQuaternion(entity);

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

      if (input.jump && !this.isAirborne) {
        this.isAirborne = true;
        this.physicsSystem.applyForce(body.obj, 0, 10, 0);
      }

      if (input.moved && !input.jump && !this.isAirborne) {
        this.physicsSystem.moveBody(body.obj, velocity.x, velocity.y, velocity.z);
      }

      this.physicsSystem.rotateBody(body.obj, quaternion.x, quaternion.y, quaternion.z);

      const position = getPosition(entity);
      body.prevY = position.y;
    }
  }
}

KeyboardMovementSystem.queries = {
  keyboardInput: {
    components: [
      KeyboardMotion,
      Body,
    ],
  },
};