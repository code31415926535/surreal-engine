import { Vector3 } from "three";

export default class FollowCamera {
  constructor(
    public idealLookAt: Vector3, 
    public idealOffset: Vector3, 
    public followRotation: boolean = true
  ) {}
}
