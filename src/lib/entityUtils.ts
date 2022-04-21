import { Entity } from "ecsy";
import { Quaternion, Vector3 } from "three";
import Body, { BodySchema } from "./components/body";

export const getPosition = (target: Entity): Vector3 => {
    const body = target.getComponent(Body)! as any as BodySchema;
    const worldTransform = body.obj.getWorldTransform();
    return new Vector3(
      worldTransform.getOrigin().x(),
      worldTransform.getOrigin().y(),
      worldTransform.getOrigin().z(),
    );
  }

export const getQuaternion = (target: Entity): Quaternion => {
    const body = target.getComponent(Body)! as any as BodySchema;
    const worldTransform = body.obj.getWorldTransform();
    return new Quaternion(
      worldTransform.getRotation().x(),
      worldTransform.getRotation().y(),
      worldTransform.getRotation().z(),
      worldTransform.getRotation().w(),
    );
  }