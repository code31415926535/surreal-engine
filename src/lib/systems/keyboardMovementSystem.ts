import { System } from "ecsy";
import { Quaternion, Vector3 } from "three";
import Body, { BodySchema } from "../components/body";
import KeyboardInput, { KeyboardInputSchema } from "../components/keyboardInput";
import PhysicsSystem from "./physicsSystem";

export default class KeyboardMovementSystem extends System {
  execute() {
    for (const entity of this.queries.keyboardInput.results) {
      const keyboardInput = entity.getComponent(KeyboardInput)! as any as KeyboardInputSchema;
      const body = entity.getMutableComponent(Body)! as any as BodySchema;

      const input = {
        forward: keyboardInput.value.input.w,
        backward: keyboardInput.value.input.s,
        left: keyboardInput.value.input.a,
        right: keyboardInput.value.input.d,
        moved: keyboardInput.value.input.w ||
          keyboardInput.value.input.s ||
          keyboardInput.value.input.a ||
          keyboardInput.value.input.d,
      }

      const worldTransform = new window.Ammo.btTransform();
      body.obj.getMotionState().getWorldTransform(worldTransform);
      const isFalling = worldTransform.getOrigin().y() < body.prevY;
      const bodyQuaternion = new Quaternion(
        worldTransform.getRotation().x(),
        worldTransform.getRotation().y(),
        worldTransform.getRotation().z(),
        worldTransform.getRotation().w(),
      );

      const velocity = new Vector3();
      const quaternion = new Quaternion();

      if (input.forward) {
        velocity.add(new Vector3(1, 0, 0));
      }

      if (input.backward) {
        velocity.add(new Vector3(-1, 0, 0));
      }

      if (input.left) {
        quaternion.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 6));
      }

      if (input.right) {
        quaternion.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI / 6));
      }

      velocity.applyQuaternion(bodyQuaternion);

      if (input.moved && !isFalling) {
        this.world.getSystem(PhysicsSystem).moveBody(body.obj, velocity.x, velocity.y, velocity.z);
        this.world.getSystem(PhysicsSystem).rotateBody(body.obj, quaternion.x, quaternion.y, quaternion.z);
      }

      body.obj.getMotionState().getWorldTransform(worldTransform);
      body.prevY = worldTransform.getOrigin().y();
    }
  }
}

KeyboardMovementSystem.queries = {
  keyboardInput: {
    components: [
      KeyboardInput,
      Body,
    ],
  },
};