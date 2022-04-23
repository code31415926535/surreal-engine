import { Component, Types } from "ecsy";
import { Vector3 } from "three";

export interface FollowCameraSchema {
  idealLookAt: Vector3;
  idealOffset: Vector3;
  followRotation?: boolean;
}

export default class FollowCamera extends Component<FollowCameraSchema> {}

FollowCamera.schema = {
  idealLookAt: { type: Types.Ref },
  idealOffset: { type: Types.Ref },
  followRotation: { type: Types.Boolean, default: true },
};