import Ammo from "ammojs-typed";
import { Component, Types } from "ecsy";

export interface BodySchema {
  obj: Ammo.btRigidBody;
}

export default class Body extends Component<BodySchema> {}

Body.schema = {
  obj: { type: Types.Ref }
};
