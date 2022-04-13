import { Component, Types } from "ecsy";
import { CurvePath, Vector3 } from "three";

export interface StaticMotionSchema {
  path: CurvePath<Vector3>;
  duration: number;
  current: number;
  loop: boolean;
  // reverse: boolean;
  // pingpong: boolean;
}

export default class StaticMotion extends Component<StaticMotionSchema> {}

StaticMotion.schema = {
  path: { type: Types.Ref },
  duration: { type: Types.Number },
  current: { type: Types.Number, default: 0 },
  loop: { type: Types.Boolean },
  // reverse: { type: Types.Boolean },
  // pingpong: { type: Types.Boolean },
};