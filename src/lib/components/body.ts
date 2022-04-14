import Ammo from "ammojs-typed";
import { Component, Types } from "ecsy";

export interface BodySchema {
  obj: Ammo.btRigidBody;
  prevY: number;
}

export default class Body extends Component<BodySchema> {}

Body.schema = {
  obj: { type: Types.Ref },
  prevY: { type: Types.Number, default: 0 },
};
